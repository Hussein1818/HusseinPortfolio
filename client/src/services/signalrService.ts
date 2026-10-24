import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
} from '@microsoft/signalr';
import {
  API_ORIGIN,
  mapGuestbookDtoToEntry,
  type ApiGuestbookEntryDto,
} from './portfolioApi';
import type { GuestbookEntry } from '../types/dungeon.types';

interface PortfolioSignalRHandlers {
  readonly onActiveExplorersUpdated?: (count: number) => void;
  readonly onReceiveGuestbookEntry?: (entry: GuestbookEntry) => void;
  readonly onUpdateGuestbookEntry?: (entry: GuestbookEntry) => void;
  readonly onRemoveGuestbookEntry?: (id: string) => void;
}

export function createPortfolioHubConnection(
  handlers: PortfolioSignalRHandlers
): {
  start: () => Promise<void>;
  stop: () => Promise<void>;
} {
  let connection: HubConnection | null = null;
  let isDisposed = false;

  const start = async (): Promise<void> => {
    if (isDisposed || connection) return;

    connection = new HubConnectionBuilder()
      .withUrl(`${API_ORIGIN}/hubs/portfolio`, {
        withCredentials: true,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(LogLevel.Warning)
      .build();

    connection.on('ActiveExplorersUpdated', (count: number) => {
      if (!isDisposed && typeof count === 'number') {
        handlers.onActiveExplorersUpdated?.(Math.max(1, count));
      }
    });

    connection.on('ReceiveGuestbookEntry', (dto: ApiGuestbookEntryDto) => {
      if (!isDisposed && dto) {
        handlers.onReceiveGuestbookEntry?.(mapGuestbookDtoToEntry(dto));
      }
    });

    connection.on('UpdateGuestbookEntry', (dto: ApiGuestbookEntryDto) => {
      if (!isDisposed && dto) {
        handlers.onUpdateGuestbookEntry?.(mapGuestbookDtoToEntry(dto));
      }
    });

    connection.on('RemoveGuestbookEntry', (id: string) => {
      if (!isDisposed && id) {
        handlers.onRemoveGuestbookEntry?.(id);
      }
    });

    try {
      await connection.start();
    } catch {
      // Silent fallback when backend server is unreachable
    }
  };

  const stop = async (): Promise<void> => {
    isDisposed = true;
    if (connection) {
      const current = connection;
      connection = null;
      try {
        await current.stop();
      } catch {
        // Ignore stop errors on unmount
      }
    }
  };

  return { start, stop };
}