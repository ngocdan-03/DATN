package com.NgocDan.BACKEND.mapper;


import com.NgocDan.BACKEND.dto.response.UserResponse;
import com.NgocDan.BACKEND.model.Role;
import com.NgocDan.BACKEND.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
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
}
