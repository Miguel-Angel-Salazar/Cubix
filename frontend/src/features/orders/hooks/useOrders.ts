"use client";

import { useCallback, useEffect, useState } from "react";
import { Order } from "../domain";
import { OrderService } from "../services/order.service";

export function useMyOrders(enabled = true) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await OrderService.getMyOrders();
      setOrders(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "No se pudieron cargar tus pedidos.";
      setError(message);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setError(null);
    return fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (!enabled) return;
    void Promise.resolve().then(() => fetchOrders());
  }, [enabled, fetchOrders]);

  return { orders, isLoading, error, refetch };
}

export function useAllOrders(enabled = true) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await OrderService.getAllOrders();
      setOrders(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "No se pudieron cargar los pedidos.";
      setError(message);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setError(null);
    return fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (!enabled) return;
    void Promise.resolve().then(() => fetchOrders());
  }, [enabled, fetchOrders]);

  return { orders, isLoading, error, refetch };
}
