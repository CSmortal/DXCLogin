package com.dxc.login.service;

import com.dxc.login.Role;
import com.dxc.login.authObject.LoginRequest;
import com.dxc.login.authObject.LoginResponse;
import com.dxc.login.authObject.RegisterRequest;
import com.dxc.login.authObject.RegisterResponse;
import com.dxc.login.entity.User;
import com.dxc.login.jwt.JwtService;
import com.dxc.login.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;

    public RegisterResponse register(RegisterRequest request) {
        Role selectedRole = request.isManager() ? Role.MANAGER : Role.USER;
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail()) // altho this column should be unique, we dont proactively check the database if there is a duplicate value, because we might have race conditions (there could be another register request of the same email that has not yet been saved)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(selectedRole)
                .build();


        try {
            userRepository.save(user);
            String jwtToken = jwtService.generateToken(user);

            return RegisterResponse.builder()
                    .token(jwtToken)
                    .success(true)
                    .manager(selectedRole == Role.MANAGER)
                    .name(request.getName())
                    .email(request.getEmail())
                    .build();

        } catch (Exception e) {
            String errorMessage;
            if (e.getClass().equals(DataIntegrityViolationException.class)) {
                errorMessage = "Email has already been registered";
            } else {
                errorMessage = e.getMessage();
            }
            System.out.println(e.getMessage());

            return RegisterResponse.builder()
                    .success(false)
                    .errorMessage(errorMessage)
                    .build();
        }
    }

    public LoginResponse authenticate(LoginRequest request) {
        try {
            Authentication result = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            SecurityContextHolder.getContext().setAuthentication(result);
            User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
            String token = jwtService.generateToken(user);
            boolean isManager = user.getRole().equals(Role.MANAGER);

            return LoginResponse.builder()
                    .token(token)
                    .success(true)
                    .manager(isManager)
                    .name(user.getName())
                    .email(request.getEmail())
                    .build();
        } catch (Exception e) {
            return LoginResponse.builder()
                    .success(false)
                    .errorMsg(e.getMessage())
                    .build();
        }

    }
}
