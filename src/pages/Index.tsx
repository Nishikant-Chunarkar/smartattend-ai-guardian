import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, QrCode, BarChart3, Users, ArrowRight, Scan } from 'lucide-react';

const Index = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && profile) {
      // Redirect authenticated users to their appropriate dashboard
      if (profile.role === 'teacher') {
        navigate('/teacher');
      } else if (profile.role === 'student') {
        navigate('/student');
      }
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <GraduationCap className="h-16 w-16 text-primary mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SmartAttend
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            AI-powered attendance management system with QR code scanning, real-time insights, and comprehensive reporting for educational institutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/auth">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-6 w-6 text-primary" />
                QR Code Attendance
              </CardTitle>
              <CardDescription>
                Generate secure, time-limited QR codes for quick and accurate attendance marking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Auto-expiring QR codes (5 minutes)</li>
                <li>• Prevents proxy attendance</li>
                <li>• Real-time attendance logging</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                AI-Powered Insights
              </CardTitle>
              <CardDescription>
                Get intelligent analytics and attendance insights powered by artificial intelligence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Anomaly detection</li>
                <li>• Attendance trend analysis</li>
                <li>• Automated alerts and reports</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Role-Based Access
              </CardTitle>
              <CardDescription>
                Separate dashboards and permissions for teachers and students with secure data handling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Teacher dashboard with analytics</li>
                <li>• Student attendance history</li>
                <li>• Secure role-based permissions</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 rounded-full p-6 mb-4">
                <QrCode className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">1. Generate QR Code</h3>
              <p className="text-muted-foreground text-sm">
                Teachers create time-limited QR codes for each class session
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 rounded-full p-6 mb-4">
                <Scan className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">2. Scan to Attend</h3>
              <p className="text-muted-foreground text-sm">
                Students scan the QR code to mark their attendance instantly
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 rounded-full p-6 mb-4">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Get Insights</h3>
              <p className="text-muted-foreground text-sm">
                View AI-powered analytics and download comprehensive reports
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of educational institutions using SmartAttend for efficient attendance management
            </p>
            <Button asChild size="lg">
              <Link to="/auth">
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
