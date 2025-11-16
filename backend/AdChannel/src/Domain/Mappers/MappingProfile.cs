using AutoMapper;
using AdChannel.Domain.Models.Dto.Auth;
using AdChannel.Domain.Models.Users;

namespace AdChannel.Domain.Mappers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, RegisterUserDto>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));
        }
    }
}
