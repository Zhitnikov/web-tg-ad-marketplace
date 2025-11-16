using System.Security.Claims;

namespace AdChannel.Web.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static Guid GetUserId(this ClaimsPrincipal user)
            => Guid.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException());

        public static Guid GetCompanyId(this ClaimsPrincipal user)
            => Guid.Parse(user.FindFirst("CompanyId")?.Value ?? throw new InvalidOperationException());

        public static Guid GetChannelId(this ClaimsPrincipal user)
            => Guid.Parse(user.FindFirst("ChannelId")?.Value ?? throw new InvalidOperationException());
    }
}
