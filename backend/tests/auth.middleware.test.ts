import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Request, Response } from "express";
import { authMiddleware } from "../src/interface/http/middlewares/auth.middleware";
import { TokenService } from "../src/infrastructure/security/token.service";
import { AuthTokenPayload } from "../src/domain/user.entity";

function createMockResponse() {
  const res: Partial<Response> = {};
  let statusCode = 200;
  let jsonBody: unknown = null;

  res.status = (code: number) => {
    statusCode = code;
    return res as Response;
  };

  res.json = (body: unknown) => {
    jsonBody = body;
    return res as Response;
  };

  return {
    res: res as Response,
    getStatus: () => statusCode,
    getBody: () => jsonBody,
  };
}

describe("authMiddleware", () => {
  it("debe responder 401 si no se envía cabecera Authorization", () => {
    const req = { headers: {} } as Request;
    const { res, getStatus, getBody } = createMockResponse();
    let nextCalled = false;

    authMiddleware(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(getStatus(), 401);
    assert.match(
      JSON.stringify(getBody()),
      /Acceso no autorizado\. Se requiere token de autenticación/
    );
  });

  it("debe responder 401 si el esquema no es Bearer", () => {
    const req = {
      headers: { authorization: "Basic xyz123" },
    } as unknown as Request;
    const { res, getStatus, getBody } = createMockResponse();
    let nextCalled = false;

    authMiddleware(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(getStatus(), 401);
    assert.match(JSON.stringify(getBody()), /Formato de token inválido/);
  });

  it("debe responder 401 si el token es inválido o no se puede decodificar", () => {
    const req = {
      headers: { authorization: "Bearer token-invalido-o-falso" },
    } as unknown as Request;
    const { res, getStatus, getBody } = createMockResponse();
    let nextCalled = false;

    authMiddleware(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(getStatus(), 401);
    assert.match(JSON.stringify(getBody()), /Token inválido o expirado/);
  });

  it("debe asignar req.user y llamar a next() cuando el token es válido", () => {
    const payload: AuthTokenPayload = {
      id: "usr_test_123",
      role: "USER",
    };
    const token = TokenService.sign(payload);

    const req = {
      headers: { authorization: `Bearer ${token}` },
    } as unknown as Request;
    const { res } = createMockResponse();
    let nextCalled = false;

    authMiddleware(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.equal(req.user?.id, "usr_test_123");
    assert.equal(req.user?.role, "USER");
  });
});
