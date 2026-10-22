using System.Threading;
using System.Threading.Tasks;

namespace Core.Application.Interfaces.Services;

public interface IAuthService
{
    Task<string> AuthenticateAsync(string email, string password, CancellationToken cancellationToken = default);
}