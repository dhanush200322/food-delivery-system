"use client";

import { useState, useEffect, use } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getMyOrderById } from "@/lib/api";
import { Order } from "@/types";
import { AlertState } from "@/components/ui/AlertState";
import { ArrowLeft, Clock, MapPin, Receipt, CheckCircle2, User, Phone, PhoneCall } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function OrderDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMyOrderById(id);
        setOrder(data);
      } catch (err: any) {
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-background container mx-auto px-4">
        <AlertState type="error" message={error || "Order not found"} />
        <div className="mt-8 flex justify-center">
          <Link href="/orders"><Button variant="outline">Back to Orders</Button></Link>
        </div>
      </div>
    );
  }

  const statuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  const currentStatusIndex = statuses.indexOf(order.status);
  const isCancelled = order.status === 'CANCELLED';

  const subtotal = order.orderItems?.reduce((acc, item) => acc + Number(item.subtotal), 0) || 0;
  const deliveryFee = 5.00; // Fixed for now

  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-24 pb-20 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <Link href="/orders" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Orders
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-black mb-2">Order Details</h1>
              <p className="font-mono text-muted-foreground bg-secondary/50 inline-block px-3 py-1 rounded-md text-sm">
                #{order.id.toUpperCase()}
              </p>
            </div>
            <div className="text-left md:text-right text-sm text-muted-foreground font-medium">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
            </div>
          </div>

          <div className="bg-card rounded-[2rem] border border-border shadow-sm p-6 sm:p-8 mb-8">
            <h2 className="text-xl font-bold mb-8">Order Status</h2>
            
            {isCancelled ? (
              <div className="bg-red-50 text-red-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">❌</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Order Cancelled</h3>
                <p>This order was cancelled and will not be delivered.</p>
              </div>
            ) : (
              <div className="relative">
                {/* Progress Bar Background */}
                <div className="absolute top-6 left-[10%] right-[10%] h-1.5 bg-secondary rounded-full hidden sm:block"></div>
                {/* Progress Bar Fill */}
                <div 
                  className="absolute top-6 left-[10%] h-1.5 bg-primary rounded-full hidden sm:block transition-all duration-1000"
                  style={{ width: `${(Math.max(0, currentStatusIndex) / (statuses.length - 1)) * 80}%` }}
                ></div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-0 relative z-10">
                  {statuses.map((status, index) => {
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    
                    return (
                      <div key={status} className="flex sm:flex-col items-center gap-4 sm:gap-3 group">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 ${
                          isCompleted ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-secondary text-muted-foreground'
                        } ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}`}>
                          {isCompleted ? <CheckCircle2 size={24} /> : <span className="w-2.5 h-2.5 rounded-full bg-current opacity-50"></span>}
                        </div>
                        <div className="sm:text-center">
                          <p className={`text-sm font-bold ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {status.replace(/_/g, ' ')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card rounded-[2rem] border border-border shadow-sm p-6 sm:p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Receipt className="text-primary" size={20} /> Order Items
                </h2>
                <div className="space-y-6">
                  {order.orderItems?.map(item => (
                    <div key={item.id} className="flex justify-between items-center border-b border-border/50 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="bg-secondary text-muted-foreground font-bold w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                          {item.quantity}x
                        </div>
                        <div>
                          <p className="font-bold text-lg">{item.food.name}</p>
                          <p className="text-sm text-muted-foreground">${Number(item.unitPrice).toFixed(2)} each</p>
                        </div>
                      </div>
                      <p className="font-bold text-lg">${Number(item.subtotal).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-8">
              <div className="bg-card rounded-[2rem] border border-border shadow-sm p-6 sm:p-8">
                <h2 className="text-lg font-bold mb-6">Summary</h2>
                <div className="space-y-4 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                  </div>
                </div>
                <div className="border-t border-border pt-4 flex justify-between items-end">
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-black text-primary">${Number(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-card rounded-[2rem] border border-border shadow-sm p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                    <MapPin size={16} /> Delivery Info
                  </h3>
                  <div className="bg-secondary/30 p-4 rounded-xl space-y-3">
                    <div className="flex items-start gap-3">
                      <User size={16} className="mt-0.5 text-muted-foreground" />
                      <span className="font-medium">{order.customerName}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone size={16} className="mt-0.5 text-muted-foreground" />
                      <span className="font-medium">{order.customerPhone}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="mt-0.5 text-muted-foreground" />
                      <span className="font-medium leading-relaxed">{order.deliveryAddress}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {order.restaurant && (
                <div className="bg-card rounded-[2rem] border border-border shadow-sm p-6 sm:p-8">
                   <h3 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">
                    Restaurant
                  </h3>
                  <div className="font-bold text-lg mb-1">{order.restaurant.name}</div>
                  <div className="text-sm text-muted-foreground mb-4">{order.restaurant.address}</div>
                  {order.restaurant.phoneNumber && (
                    <Button variant="outline" className="w-full gap-2 rounded-xl">
                      <PhoneCall size={16} /> Call Restaurant
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}
