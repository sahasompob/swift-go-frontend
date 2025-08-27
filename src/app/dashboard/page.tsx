"use client"

import { useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { BarChart3, TrendingUp, Truck, DollarSign } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { RootState } from '../store';

const Dashboard = () => {

  return (
    <section className="min-h-screen bg-gradient-to-br from-background to-transport-light-blue/20 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-primary mb-2">Transport Dashboard</h2>
          <p className="text-lg text-muted-foreground">Monitor and manage your transportation bookings</p>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;