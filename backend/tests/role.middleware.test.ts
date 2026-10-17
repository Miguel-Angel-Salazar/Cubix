import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Request, Response } from "express";
import { requireRole, soloAdmin } from "../src/interface/http/middlewares/role.middleware";

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

describe("roleMiddleware", () => {
  it("debe responder 401 si req.user no existe en la petición", () => {
    const req = {} as Request;
    const { res, getStatus, getBody } = createMockResponse();
    let nextCalled = false;

    soloAdmin(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(getStatus(), 401);
    assert.match(JSON.stringify(getBody()), /Acceso no autorizado/);
  });

  it("debe responder 403 si el rol del usuario no tiene permisos (ej: USER en ruta soloAdmin)", () => {
    const req = {
      user: { id: "usr_1", role: "USER" },
    } as unknown as Request;
    const { res, getStatus, getBody } = createMockResponse();
    let nextCalled = false;

    soloAdmin(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(getStatus(), 403);
    assert.match(
      JSON.stringify(getBody()),
      /Acceso denegado\. No tienes permisos para realizar esta acción/
    );
  });

  it("debe llamar a next() si el rol del usuario coincide con el rol requerido (ADMIN)", () => {
    const req = {
      user: { id: "usr_admin", role: "ADMIN" },
    } as unknown as Request;
    const { res } = createMockResponse();
    let nextCalled = false;

    soloAdmin(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
  });

  it("debe permitir varios roles si se configuran múltiples roles", () => {
    const middleware = requireRole("ADMIN", "USER");
    const req = {
      user: { id: "usr_regular", role: "USER" },
    } as unknown as Request;
    const { res } = createMockResponse();
    let nextCalled = false;

    middleware(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
  });
});
