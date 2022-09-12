import { loginRedirect, logout, loginCallback } from "../../modules/auth";
import { todoistClientId, todoistScopes } from "../../modules/secret-config";
import { Request, Response } from "express";
import { v4 as uuid } from "uuid";

describe("Auth module test", () => {
  /*
   * test token behaviour
   */
  test("test without session token", () => {
    // setup
    const req = {
      session: {},
    } as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn(),
    } as any as Response;

    // call method
    loginRedirect(req, res);

    // check calls
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        loggedIn: false,
        client_id: todoistClientId,
        scopes: todoistScopes,
        state: expect.any(String), // any UUID string?
      })
    );
  });
  test("test with session token", () => {
    // setup
    const req = {
      session: {
        todoist_token: "dummy",
      },
    } as any as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn(),
    } as any as Response;

    // call method
    loginRedirect(req, res);

    // check calls
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      loggedIn: true,
    });
  });
  /*
   * test login callback
   */
  test("test login callback with compromised state", () => {
    // setup
    const req = {
      session: {
        state_token: uuid()
      },
      query: {
        state: uuid(),
        code: uuid()
      }
    } as any as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn(),
    } as any as Response;

    // call method
    loginCallback(req, res);

    // check calls
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      message: "compromised request",
    });
  });
  /*
   * test logout
   */
  test("test session destroy", () => {
    // setup
    const req = {
      session: {
        destroy: jest.fn(),
      },
    } as any as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn(),
    } as any as Response;

    // call method
    logout(req, res);

    // check calls
    expect(req.session.destroy).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      message: "ok",
    });
  });
});
