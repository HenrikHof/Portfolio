'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
  Mail, 
  Calendar, 
  TrendingUp,
  LogOut,
  Eye,
  EyeOff
} from 'lucide-react'

interface Stats {
  total: number
  unread: number
  today: number
  thisWeek: number
  thisMonth: number
}

interface Submission {
  id: number
  name: string
  email: string
  message: string
  created_at: string
  read: boolean
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  useEffect(() => {
    loadData()
  }, [showUnreadOnly])

  const loadData = async () => {
    try {
      // Load stats
      const statsRes = await fetch('/api/admin/stats')
      if (!statsRes.ok) {
        router.push('/management-panel')
        return
      }
      const statsData = await statsRes.json()
      setStats(statsData)

      // Load submissions
      const submissionsRes = await fetch(
        `/api/admin/submissions?unread=${showUnreadOnly}`
      )
      if (!submissionsRes.ok) {
        router.push('/management-panel')
        return
      }
      const submissionsData = await submissionsRes.json()
      setSubmissions(submissionsData.submissions)
    } catch (error) {
      console.error('Error loading data:', error)
      router.push('/management-panel')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/management-panel')
  }

  const toggleRead = async (id: number, currentRead: boolean) => {
    try {
      const response = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, read: !currentRead }),
      })

      if (response.ok) {
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub.id === id ? { ...sub, read: !currentRead } : sub
          )
        )
        loadData() // Reload stats
      }
    } catch (error) {
      console.error('Error updating submission:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage contact submissions</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total || 0}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {stats?.unread || 0}
              </div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.today || 0}</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.thisWeek || 0}</div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.thisMonth || 0}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Submissions List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Contact Submissions</CardTitle>
                <CardDescription>
                  Recent contact form submissions
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUnreadOnly(!showUnreadOnly)}
              >
                {showUnreadOnly ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Show All
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Show Unread Only
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No submissions found
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className={`p-4 border rounded-lg space-y-2 ${
                      !submission.read ? 'bg-muted/50 border-primary/20' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{submission.name}</h3>
                          <Badge variant={submission.read ? 'secondary' : 'default'}>
                            {submission.read ? 'Read' : 'Unread'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {submission.email}
                        </p>
                        <p className="text-sm mt-2">{submission.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(submission.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRead(submission.id, submission.read)}
                      >
                        {submission.read ? (
                          <>
                            <EyeOff className="mr-2 h-4 w-4" />
                            Mark Unread
                          </>
                        ) : (
                          <>
                            <Eye className="mr-2 h-4 w-4" />
                            Mark Read
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

