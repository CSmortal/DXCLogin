package com.dxc.login.validator;

import com.dxc.login.authObject.RegisterRequest;

public class RegisterValidator {
    public static boolean validate(RegisterRequest request) {
        if (request.getName().length() <= 1) {
            return false;
        }
        if (request.getEmail().length() <= 5) {
            return false;
        }
        if (request.getPassword().length() < 4) {
            return false;
        }

        return true;
    }
}
