package com.NgocDan.BACKEND.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NgocDan.BACKEND.model.Ward;

@Repository
public interface WardRepository extends JpaRepository<Ward, Integer> {}
