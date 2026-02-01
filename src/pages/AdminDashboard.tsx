import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  AlertTriangle,
  Activity
} from "lucide-react";

const API_URL = "http://localhost:3000";

interface DashboardStats {
  users: {
    total: number;
    active: number;
    blocked: number;
  };
  products: {
    total: number;
    totalStock: number;
    lowStock: number;
    byCategory: { [key: string]: number };
  };
  carts: {
    total: number;
    active: number;
    totalRevenue: string;
    avgCartValue: string;
    totalItems: number;
  };
  recentUsers: Array<{
    id: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
  }>;
}

interface ActivityLog {
  type: string;
  userId: string;
  description: string;
  timestamp: string;
  amount?: number;
  role?: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const statsResponse = await fetch(`${API_URL}/admin/dashboard/stats`);
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        setStats(statsData.stats);
      }
      
      // Fetch activity logs
      const activityResponse = await fetch(`${API_URL}/admin/dashboard/activity`);
      const activityData = await activityResponse.json();
      
      if (activityData.success) {
        setActivities(activityData.activities);
      }
      
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container-main py-20">
          <div className="text-center">Loading dashboard...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="py-12 md:py-20">
        <div className="container-main">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-heading-xl mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your e-commerce platform
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Total Users */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.users.total || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.users.active || 0} active, {stats?.users.blocked || 0} blocked
                </p>
              </CardContent>
            </Card>

            {/* Total Products */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.products.total || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.products.totalStock || 0} items in stock
                </p>
              </CardContent>
            </Card>

            {/* Active Carts */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Carts</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.carts.active || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.carts.totalItems || 0} total items
                </p>
              </CardContent>
            </Card>

            {/* Total Revenue */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats?.carts.totalRevenue || "0.00"}</div>
                <p className="text-xs text-muted-foreground">
                  Avg: ${stats?.carts.avgCartValue || "0.00"} per cart
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Alerts */}
          {stats && stats.products.lowStock > 0 && (
            <Card className="mb-8 border-orange-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Low Stock Alert
                </CardTitle>
                <CardDescription>
                  {stats.products.lowStock} products have less than 10 items in stock
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          <div className="grid gap-8 md:grid-cols-2">
            {/* Recent Users */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>Latest registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats?.recentUsers.slice(0, 5).map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "default" : "destructive"}>
                            {user.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4">
                  <Link to="/admin/users">
                    <Button variant="outline" className="w-full">
                      Manage All Users
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest platform activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <div className={`mt-0.5 h-2 w-2 rounded-full ${
                        activity.type === "cart_update" ? "bg-blue-500" : "bg-green-500"
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {activity.amount && (
                        <span className="font-semibold text-green-600">
                          ${activity.amount.toFixed(2)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Link to="/admin/products">
                  <Button className="w-full" variant="outline">
                    <Package className="mr-2 h-4 w-4" />
                    Manage Products
                  </Button>
                </Link>
                <Link to="/admin/users">
                  <Button className="w-full" variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Button>
                </Link>
                <Link to="/admin/sales">
                  <Button className="w-full" variant="outline">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Sales Report
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Products by Category */}
          {stats && stats.products.byCategory && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Products by Category</CardTitle>
                <CardDescription>Distribution of products across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  {Object.entries(stats.products.byCategory).map(([category, count]) => (
                    <div key={category} className="border rounded-lg p-4">
                      <p className="text-sm font-medium capitalize mb-1">{category}</p>
                      <p className="text-2xl font-bold">{count}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
