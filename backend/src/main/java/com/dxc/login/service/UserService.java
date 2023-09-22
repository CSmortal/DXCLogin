package com.dxc.login.service;

import com.dxc.login.entity.User;
import com.dxc.login.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;

    public Optional<User> findUserByEmail(String email) {
        return repository.findByEmail(email);
    }
}
