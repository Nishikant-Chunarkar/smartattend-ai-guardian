import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QrCode, Users, BarChart3, Download, LogOut, Plus } from 'lucide-react';

const TeacherDashboard = () => {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <QrCode className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">SmartAttend</h1>
              <p className="text-sm text-muted-foreground">Teacher Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{profile?.name}</p>
              <Badge variant="secondary">Teacher</Badge>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* QR Code Generation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                QR Code Generator
              </CardTitle>
              <CardDescription>
                Generate attendance QR codes for your classes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Generate QR Code
              </Button>
              <div className="text-center p-8 border-2 border-dashed rounded-lg">
                <QrCode className="h-16 w-16 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  QR code will appear here
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Manage your classes and attendance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Create New Class
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Reports
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                AI Insights
              </CardTitle>
              <CardDescription>
                Attendance analytics powered by AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium">Weekly Overview</p>
                  <p className="text-xs text-muted-foreground">
                    Class average attendance: 85%
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <p className="text-sm font-medium">Alert</p>
                  <p className="text-xs text-muted-foreground">
                    3 students below 75% attendance
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm font-medium">Improvement</p>
                  <p className="text-xs text-muted-foreground">
                    Attendance up 12% this week
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Classes */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Classes</CardTitle>
            <CardDescription>
              Your recent teaching sessions and attendance data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">No classes yet</p>
              <p className="text-muted-foreground mb-4">
                Create your first class to start taking attendance
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create First Class
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;