package com.NgocDan.BACKEND.mapper;


import com.NgocDan.BACKEND.dto.request.UserUpdateRequest;
import com.NgocDan.BACKEND.dto.response.UserDashboardResponse;
import com.NgocDan.BACKEND.dto.response.UserResponse;
import com.NgocDan.BACKEND.model.Role;
import com.NgocDan.BACKEND.model.User;
import org.mapstruct.*;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {
    @Mapping(target = "roles", source = "roles", qualifiedByName = "mapRoles")
    UserResponse toUserResponse(User user);
    @Named("mapRoles")
    default Set<String> mapRoles(Set<Role> roles){
        if(roles == null) return null;
        return roles.stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
        }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "balance", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updateAt", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);

    UserDashboardResponse toDashboardResponse(User user);
}
