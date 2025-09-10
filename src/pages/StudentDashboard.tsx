import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { QrCode, Scan, Calendar, BarChart3, LogOut, Camera } from 'lucide-react';

const StudentDashboard = () => {
  const { profile, signOut } = useAuth();

  // Mock data for demonstration
  const attendancePercentage = 78;
  const totalClasses = 45;
  const attendedClasses = 35;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-green-50 dark:from-blue-950/20 dark:via-background dark:to-green-950/20">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scan className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">SmartAttend</h1>
              <p className="text-sm text-muted-foreground">Student Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{profile?.name}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Student</Badge>
                {profile?.student_id && (
                  <Badge variant="secondary" className="text-xs">
                    {profile.student_id}
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Scanner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Mark Attendance
              </CardTitle>
              <CardDescription>
                Scan QR code to mark your attendance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" size="lg">
                <Scan className="h-5 w-5 mr-2" />
                Open QR Scanner
              </Button>
              <div className="text-center p-8 border-2 border-dashed rounded-lg">
                <QrCode className="h-16 w-16 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Camera will open here to scan QR codes
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Attendance Summary
              </CardTitle>
              <CardDescription>
                Your current attendance statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {attendancePercentage}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Overall Attendance
                </p>
              </div>
              <Progress value={attendancePercentage} className="w-full" />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-semibold text-green-600">
                    {attendedClasses}
                  </div>
                  <p className="text-xs text-muted-foreground">Attended</p>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-orange-600">
                    {totalClasses - attendedClasses}
                  </div>
                  <p className="text-xs text-muted-foreground">Missed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Attendance */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Attendance
            </CardTitle>
            <CardDescription>
              Your attendance history for the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Mock attendance records */}
              {[
                { date: '2024-01-15', class: 'Mathematics', status: 'Present', time: '09:00 AM' },
                { date: '2024-01-14', class: 'Physics', status: 'Present', time: '11:00 AM' },
                { date: '2024-01-13', class: 'Chemistry', status: 'Absent', time: '-' },
                { date: '2024-01-12', class: 'Biology', status: 'Present', time: '02:00 PM' },
              ].map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium">{record.date}</div>
                    <div className="text-sm text-muted-foreground">{record.class}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-muted-foreground">{record.time}</div>
                    <Badge 
                      variant={record.status === 'Present' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {record.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Alert for low attendance */}
            {attendancePercentage < 80 && (
              <div className="mt-4 p-4 bg-orange-100 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                  <BarChart3 className="h-4 w-4" />
                  <span className="font-medium">Attendance Warning</span>
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  Your attendance is below 80%. Please attend classes regularly to meet the minimum requirement.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;