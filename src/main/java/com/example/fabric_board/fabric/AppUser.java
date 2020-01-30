package com.example.fabric_board.fabric;

import org.hyperledger.fabric.sdk.Enrollment;
import org.hyperledger.fabric.sdk.User;
import java.io.Serializable;
import java.util.Set;

public class AppUser implements User, Serializable {
    String name;
    Set<String> roles;
    String account;
    String affiliation;
    String mspid;

    String org1;
    Enrollment enrollment;

    // admin = new AppUser("admin", "org1", "Org1MSP", adminEnrollment);
    public AppUser(String userId, String org1, String org1MSP, Enrollment enrollment) {
        this.name=userId;
        this.org1=org1;
        this.mspid=org1MSP;
        this.enrollment=enrollment;

    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public Set<String> getRoles() {
        return this.roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    @Override
    public String getAccount() {
        return this.account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    @Override
    public String getAffiliation() {
        return affiliation;
    }

    @Override
    public Enrollment getEnrollment() {
        return enrollment;
    }

    @Override
    public String getMspId() {
        return mspid;
    }

}
