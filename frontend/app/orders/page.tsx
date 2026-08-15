"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getMyOrders } from "@/lib/api";
import { Order } from "@/types";
import { AlertState } from "@/components/ui/AlertState";
import { Package, Clock, ExternalLink, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

function OrderStatusBadge({ status }: { status: Order["status"] }) {
  const statusConfig = {
    PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
    CONFIRMED: { color: "bg-blue-100 text-blue-800", label: "Confirmed" },
    PREPARING: { color: "bg-orange-100 text-orange-800", label: "Preparing" },
    OUT_FOR_DELIVERY: { color: "bg-purple-100 text-purple-800", label: "On the way" },
    DELIVERED: { color: "bg-green-100 text-green-800", label: "Delivered" },
    CANCELLED: { color: "bg-red-100 text-red-800", label: "Cancelled" },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <span className={`px-3 py-1 text-xs font-bold rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyOrders(1, 20);
      setOrders(data.orders);
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-32 pb-20 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black mb-2">Order History</h1>
              <p className="text-muted-foreground text-lg">
                Track and manage your recent orders.
              </p>
            </div>
            <Button variant="outline" onClick={fetchOrders} disabled={loading} className="gap-2 self-start sm:self-auto">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </Button>
          </div>

          {loading && orders.length === 0 ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-card rounded-[2rem] border border-border animate-pulse shadow-sm"></div>
              ))}
            </div>
          ) : error ? (
            <AlertState type="error" message={error} onRetry={fetchOrders} />
          ) : orders.length === 0 ? (
            <div className="bg-secondary/30 rounded-[2rem] p-12 text-center border border-border/50">
              <Package size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
              <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">Looks like you haven't placed any orders.</p>
              <Link href="/foods">
                <Button size="lg" className="rounded-xl">Start Ordering</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-border rounded-[2rem] p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
                >
                  <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] pointer-events-none -z-10 group-hover:bg-primary/10 transition-colors" />
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-2 text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg text-sm font-medium">
                        <Clock size={16} />
                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <div className="font-mono text-sm text-muted-foreground">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-6 sm:items-end border-t border-border pt-6">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium mb-1">
                        {order.orderItems?.length || 0} {order.orderItems?.length === 1 ? 'item' : 'items'}
                      </p>
                      <h3 className="text-xl font-bold line-clamp-1">
                        {order.restaurant?.name || "Restaurant"}
                      </h3>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center w-full sm:w-auto">
                      <div className="text-left sm:text-right">
                        <p className="text-sm text-muted-foreground font-medium mb-0.5">Total</p>
                        <p className="text-2xl font-black">${Number(order.totalAmount).toFixed(2)}</p>
                      </div>
                      
                      <Link href={`/orders/${order.id}`} className="w-full sm:w-auto mt-2 sm:mt-0">
                        <Button className="w-full sm:w-auto h-12 rounded-xl group-hover:bg-primary/90 transition-colors">
                          View Details
                          <ExternalLink size={18} className="ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
