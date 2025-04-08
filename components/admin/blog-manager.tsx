"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import type { BlogPost } from "@/lib/blog";
import { formatDate } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Loader2, ImageIcon } from "lucide-react";

export default function AdminBlogManager() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    title_am: "",
    content: "",
    content_am: "",
    excerpt: "",
    excerpt_am: "",
    published: false,
    image: null as File | null,
    image_path: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("en");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/blog?publishedOnly=false");
      if (!response.ok) throw new Error("Failed to fetch blog posts");
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, published: checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      title_am: "",
      content: "",
      content_am: "",
      excerpt: "",
      excerpt_am: "",
      published: false,
      image: null,
      image_path: "",
    });
    setImagePreview(null);
    setSelectedBlog(null);
    setActiveTab("en");
  };

  const handleCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (item: BlogPost) => {
    setSelectedBlog(item);
    setFormData({
      id: item.id.toString(),
      title: item.title,
      title_am: item.title_am || "",
      content: item.content,
      content_am: item.content_am || "",
      excerpt: item.excerpt || "",
      excerpt_am: item.excerpt_am || "",
      published: item.published,
      image: null,
      image_path: item.image_path || "",
    });
    setImagePreview(item.image_path || null);
    setIsDialogOpen(true);
  };

  const handleDelete = (item: BlogPost) => {
    setSelectedBlog(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedBlog) return;

    try {
      const response = await fetch(`/api/blog?id=${selectedBlog.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete blog post");

      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });

      fetchBlogs();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    try {
      // Handle image upload first if there's a new image
      let imagePath = formData.image_path;
      if (formData.image) {
        try {
          setIsUploading(true);
          const uploadFormData = new FormData();
          uploadFormData.append("file", formData.image);
          uploadFormData.append("type", "blog");

          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: uploadFormData,
          });

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(errorData.error || "Failed to upload image");
          }

          const uploadData = await uploadResponse.json();
          imagePath = uploadData.path;
          setIsUploading(false);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to upload image. Please try again.",
            variant: "destructive",
          });
          setIsUploading(false);
          return;
        }
      }

      // Prepare data for API
      const formDataToSend = new FormData();

      if (selectedBlog) {
        formDataToSend.append("id", formData.id);
      }

      formDataToSend.append("title", formData.title);
      formDataToSend.append("title_am", formData.title_am || "");
      formDataToSend.append("content", formData.content);
      formDataToSend.append("content_am", formData.content_am || "");
      formDataToSend.append("excerpt", formData.excerpt || "");
      formDataToSend.append("excerpt_am", formData.excerpt_am || "");
      formDataToSend.append("published", formData.published.toString());

      // If we have a new image path from upload, use it
      if (imagePath) {
        formDataToSend.append("image_path", imagePath);
      }

      const response = await fetch("/api/blog", {
        method: selectedBlog ? "PUT" : "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to ${selectedBlog ? "update" : "create"} blog post`
        );
      }

      toast({
        title: "Success",
        description: `Blog post ${
          selectedBlog ? "updated" : "created"
        } successfully`,
      });

      setIsDialogOpen(false);
      fetchBlogs();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : `Failed to ${selectedBlog ? "update" : "create"} blog post`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Blog Posts</h2>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Blog Post
        </Button>
      </div>

      {blogs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <p className="text-muted-foreground mb-4">No blog posts found</p>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Blog Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {blogs.map((item) => (
            <Card
              key={item.id}
              className={!item.published ? "border-dashed" : ""}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>
                      {formatDate(item.created_at)} •{" "}
                      {item.published ? "Published" : "Draft"}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {item.excerpt || item.content.substring(0, 150) + "..."}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedBlog ? "Edit Blog Post" : "Create Blog Post"}
            </DialogTitle>
            <DialogDescription>
              {selectedBlog
                ? "Update the blog post details below"
                : "Fill in the details to create a new blog post"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="am">Amharic</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="en" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter blog post title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Enter blog post content"
                    rows={10}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt (optional)</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    placeholder="Enter a short excerpt"
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="am" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title_am">Title (Amharic)</Label>
                  <Input
                    id="title_am"
                    name="title_am"
                    value={formData.title_am}
                    onChange={handleInputChange}
                    placeholder="Enter blog post title in Amharic"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content_am">Content (Amharic)</Label>
                  <Textarea
                    id="content_am"
                    name="content_am"
                    value={formData.content_am}
                    onChange={handleInputChange}
                    placeholder="Enter blog post content in Amharic"
                    rows={10}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt_am">
                    Excerpt (Amharic, optional)
                  </Label>
                  <Textarea
                    id="excerpt_am"
                    name="excerpt_am"
                    value={formData.excerpt_am}
                    onChange={handleInputChange}
                    placeholder="Enter a short excerpt in Amharic"
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image">Featured Image</Label>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <div className="relative w-24 h-24 rounded overflow-hidden">
                        <img
                          src={
                            imagePreview.startsWith("data:")
                              ? imagePreview
                              : imagePreview
                          }
                          alt="Preview"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <Label htmlFor="image" className="cursor-pointer">
                        <div className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground">
                            Click to {imagePreview ? "change" : "upload"} image
                          </span>
                        </div>
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="published">Publish this blog post</Label>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : selectedBlog ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              blog post "{selectedBlog?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
