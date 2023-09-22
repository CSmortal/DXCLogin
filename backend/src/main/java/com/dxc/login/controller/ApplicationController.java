package com.dxc.login.controller;

import com.dxc.login.Role;
import com.dxc.login.entity.User;
import com.dxc.login.jwt.JwtService;
import com.dxc.login.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ApplicationController {

    private final JwtService jwtService;
    private final UserService userService;
    @GetMapping("/manager")
    public ResponseEntity<Boolean> getManagerContent(@RequestHeader("Authorization") String token) {
        String email = jwtService.extractUsername(token);
        Optional<User> userOpt = userService.findUserByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Role role = user.getRole();
            if (role.equals(Role.MANAGER)) {
                return ResponseEntity.ok(true);
            } else {
                return ResponseEntity.status(HttpStatusCode.valueOf(403)).body(false);
            }

        } else {
            return ResponseEntity.status(HttpStatusCode.valueOf(400)).body(false);
        }

    }
}
