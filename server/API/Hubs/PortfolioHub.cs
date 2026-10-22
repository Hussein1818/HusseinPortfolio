using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace API.Hubs;

public class PortfolioHub : Hub
{
    private static int _activeExplorers = 0;

    public override async Task OnConnectedAsync()
    {
        var count = Interlocked.Increment(ref _activeExplorers);
        await Clients.All.SendAsync("ActiveExplorersUpdated", count);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var count = Interlocked.Decrement(ref _activeExplorers);
        if (count < 0)
        {
            Interlocked.Exchange(ref _activeExplorers, 0);
            count = 0;
        }
        await Clients.All.SendAsync("ActiveExplorersUpdated", count);
        await base.OnDisconnectedAsync(exception);
    }
}