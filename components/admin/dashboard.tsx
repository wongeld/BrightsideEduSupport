"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import type { User } from "@/lib/auth";
import AdminNewsManager from "@/components/admin/news-manager";
import AdminBlogManager from "@/components/admin/blog-manager";
import AdminVacanciesManager from "@/components/admin/vacancies-manager";
import AdminMessagesManager from "@/components/admin/messages-manager";
import AdminSettings from "@/components/admin/settings";
import {
  FileText,
  Mail,
  Newspaper,
  Briefcase,
  Settings,
  LogOut,
} from "lucide-react";
import { getAuthCookie, removeAuthCookie } from "@/lib/client-cookies";

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("news");

  useEffect(() => {
    async function checkAuth() {
      try {
        // Check if we have a client-side cookie
        const authCookie = getAuthCookie();
        console.log("Client-side auth cookie exists:", !!authCookie);

        const response = await fetch("/api/auth/user");
        console.log("Auth check response status:", response.status);

        if (!response.ok) {
          throw new Error("Not authenticated");
        }

        const userData = await response.json();
        console.log("User data received:", userData);
        setUser(userData);
      } catch (error) {
        console.error("Authentication error:", error);
        toast({
          title: "Authentication Error",
          description: "Please log in to access the admin dashboard",
          variant: "destructive",
        });
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router, toast]);

  const handleLogout = async () => {
    try {
      // Remove client-side cookie
      removeAuthCookie();

      await fetch("/api/auth/logout", {
        method: "POST",
      });

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });

      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.username}
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="news" className="flex items-center">
            <Newspaper className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">News</span>
          </TabsTrigger>
          <TabsTrigger value="blog" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Blog</span>
          </TabsTrigger>
          <TabsTrigger value="vacancies" className="flex items-center">
            <Briefcase className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Vacancies</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Messages</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="space-y-4">
          <AdminNewsManager />
        </TabsContent>

        <TabsContent value="blog" className="space-y-4">
          <AdminBlogManager />
        </TabsContent>

        <TabsContent value="vacancies" className="space-y-4">
          <AdminVacanciesManager />
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <AdminMessagesManager />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
