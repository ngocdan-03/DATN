package com.NgocDan.BACKEND.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NgocDan.BACKEND.model.Permiss;

@Repository
public interface PermissionRepository extends JpaRepository<Permiss, Integer> {}
