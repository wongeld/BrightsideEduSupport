"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/context/language-context"
import type { Vacancy } from "@/lib/vacancies"
import { formatDate } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, Calendar, MapPin, Link } from "lucide-react"

export default function AdminVacanciesManager() {
  const { toast } = useToast()
  const { language } = useLanguage()
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    title_am: "",
    description: "",
    description_am: "",
    requirements: "",
    requirements_am: "",
    location: "",
    location_am: "",
    type: "",
    type_am: "",
    google_form_link: "",
    deadline: "",
    published: false,
  })
  const [activeTab, setActiveTab] = useState("en")

  useEffect(() => {
    fetchVacancies()
  }, [])

  const fetchVacancies = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/vacancies?publishedOnly=false")
      if (!response.ok) throw new Error("Failed to fetch vacancies")
      const data = await response.json()
      setVacancies(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load vacancies",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, published: checked }))
  }

  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      title_am: "",
      description: "",
      description_am: "",
      requirements: "",
      requirements_am: "",
      location: "",
      location_am: "",
      type: "",
      type_am: "",
      google_form_link: "",
      deadline: "",
      published: false,
    })
    setSelectedVacancy(null)
    setActiveTab("en")
  }

  const handleCreate = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleEdit = (item: Vacancy) => {
    setSelectedVacancy(item)
    setFormData({
      id: item.id.toString(),
      title: item.title,
      title_am: item.title_am || "",
      description: item.description,
      description_am: item.description_am || "",
      requirements: item.requirements || "",
      requirements_am: item.requirements_am || "",
      location: item.location || "",
      location_am: item.location_am || "",
      type: item.type || "",
      type_am: item.type_am || "",
      google_form_link: item.google_form_link || "",
      deadline: item.deadline ? new Date(item.deadline).toISOString().split("T")[0] : "",
      published: item.published,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (item: Vacancy) => {
    setSelectedVacancy(item)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedVacancy) return

    try {
      const response = await fetch(`/api/vacancies?id=${selectedVacancy.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete vacancy")

      toast({
        title: "Success",
        description: "Vacancy deleted successfully",
      })

      fetchVacancies()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete vacancy",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description) {
      toast({
        title: "Error",
        description: "Title and description are required",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/vacancies", {
        method: selectedVacancy ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedVacancy ? { id: Number.parseInt(formData.id), ...formData } : formData),
      })

      if (!response.ok) throw new Error("Failed to save vacancy")

      toast({
        title: "Success",
        description: `Vacancy ${selectedVacancy ? "updated" : "created"} successfully`,
      })

      setIsDialogOpen(false)
      fetchVacancies()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${selectedVacancy ? "update" : "create"} vacancy`,
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Vacancies</h2>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vacancy
        </Button>
      </div>

      {vacancies.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <p className="text-muted-foreground mb-4">No vacancies found</p>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Vacancy
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {vacancies.map((item) => (
            <Card key={item.id} className={!item.published ? "border-dashed" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>
                      {item.type && <span className="mr-3">{item.type}</span>}
                      {item.published ? "Published" : "Draft"}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(item)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {item.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{item.location}</span>
                    </div>
                  )}
                  {item.deadline && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Deadline: {formatDate(item.deadline)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedVacancy ? "Edit Vacancy" : "Create Vacancy"}</DialogTitle>
            <DialogDescription>
              {selectedVacancy ? "Update the vacancy details below" : "Fill in the details to create a new vacancy"}
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
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter job title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter job description"
                    rows={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    placeholder="Enter job requirements"
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter job location"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Job Type</Label>
                    <Input
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      placeholder="E.g., Full-time, Part-time"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="am" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title_am">Job Title (Amharic)</Label>
                  <Input
                    id="title_am"
                    name="title_am"
                    value={formData.title_am}
                    onChange={handleInputChange}
                    placeholder="Enter job title in Amharic"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description_am">Job Description (Amharic)</Label>
                  <Textarea
                    id="description_am"
                    name="description_am"
                    value={formData.description_am}
                    onChange={handleInputChange}
                    placeholder="Enter job description in Amharic"
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements_am">Requirements (Amharic)</Label>
                  <Textarea
                    id="requirements_am"
                    name="requirements_am"
                    value={formData.requirements_am}
                    onChange={handleInputChange}
                    placeholder="Enter job requirements in Amharic"
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location_am">Location (Amharic)</Label>
                    <Input
                      id="location_am"
                      name="location_am"
                      value={formData.location_am}
                      onChange={handleInputChange}
                      placeholder="Enter job location in Amharic"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type_am">Job Type (Amharic)</Label>
                    <Input
                      id="type_am"
                      name="type_am"
                      value={formData.type_am}
                      onChange={handleInputChange}
                      placeholder="Enter job type in Amharic"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="google_form_link">Application Form Link</Label>
                  <div className="flex items-center space-x-2">
                    <Link className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="google_form_link"
                      name="google_form_link"
                      value={formData.google_form_link}
                      onChange={handleInputChange}
                      placeholder="Enter Google Form or application link"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="deadline"
                      name="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="published" checked={formData.published} onCheckedChange={handleSwitchChange} />
                  <Label htmlFor="published">Publish this vacancy</Label>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{selectedVacancy ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the vacancy "{selectedVacancy?.title}".
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
  )
}

