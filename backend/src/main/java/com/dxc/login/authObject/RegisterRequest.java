package com.dxc.login.authObject;

import com.dxc.login.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private boolean manager;
}
