"use client";

import { useCallback, useEffect, useState } from "react";
import { Order } from "../domain";
import { OrderService } from "../services/order.service";

export function useMyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
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

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, isLoading, error, refetch: fetchOrders };
}

export function useAllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
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

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, isLoading, error, refetch: fetchOrders };
}
