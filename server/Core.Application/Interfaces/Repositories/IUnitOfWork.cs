using Core.Domain.Common;

namespace Core.Application.Interfaces.Repositories;

public interface IUnitOfWork : IDisposable
{
    IGenericRepository<T> Repository<T>() where T : BaseEntity;
    Task<int> CompleteAsync(CancellationToken cancellationToken = default);
}