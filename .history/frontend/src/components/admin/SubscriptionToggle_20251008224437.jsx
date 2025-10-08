import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';
import { ENDPOINTS, API_BASE_URL } from '../../config/endpoints';
import { Settings, ToggleLeft, ToggleRight, AlertTriangle, CheckCircle } from 'lucide-react';

const SubscriptionToggle = () => {
  const [betaTesting, setBetaTesting] = useState(false);
  const [razorpayFees, setRazorpayFees] = useState(false);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.SUBSCRIPTION.ADMIN.CONFIG}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'X-Admin-Key': 'your-admin-key' // Replace with actual admin key
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConfig(data.config);
        setBetaTesting(data.config.beta_testing_free);
        setRazorpayFees(data.config.razorpay_fees_from_platform);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    }
  };

  const toggleBetaTesting = async (enabled) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.SUBSCRIPTION.ADMIN.TOGGLE_BETA}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'X-Admin-Key': 'your-admin-key', // Replace with actual admin key
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ enabled })
      });

      if (response.ok) {
        setBetaTesting(enabled);
        toast({
          title: "Success",
          description: `Beta testing ${enabled ? 'enabled' : 'disabled'}`,
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.detail || "Failed to toggle beta testing",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error toggling beta testing:', error);
      toast({
        title: "Error",
        description: "Failed to toggle beta testing",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleRazorpayFees = async (platformPays) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.SUBSCRIPTION.ADMIN.UPDATE_CONFIG}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'X-Admin-Key': 'your-admin-key', // Replace with actual admin key
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ razorpay_fees_from_platform: platformPays })
      });

      if (response.ok) {
        setRazorpayFees(platformPays);
        toast({
          title: "Success",
          description: `Razorpay fees now ${platformPays ? 'paid by platform' : 'paid by teachers'}`,
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.detail || "Failed to update Razorpay fees",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating Razorpay fees:', error);
      toast({
        title: "Error",
        description: "Failed to update Razorpay fees",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Subscription Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Beta Testing Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Beta Testing Mode</h3>
                {betaTesting ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Free Access
                  </Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-800">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Paid Subscription
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {betaTesting 
                  ? "All teachers have free access to all features during beta testing"
                  : "Teachers must pay subscription fees to access premium features"
                }
              </p>
            </div>
            <Switch
              checked={betaTesting}
              onCheckedChange={toggleBetaTesting}
              disabled={loading}
            />
          </div>

          {/* Razorpay Fees Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Razorpay Transaction Fees</h3>
                {razorpayFees ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Platform Pays
                  </Badge>
                ) : (
                  <Badge className="bg-orange-100 text-orange-800">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Teachers Pay
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {razorpayFees 
                  ? "Platform covers all Razorpay transaction fees for teachers"
                  : "Teachers are responsible for Razorpay transaction fees"
                }
              </p>
            </div>
            <Switch
              checked={razorpayFees}
              onCheckedChange={toggleRazorpayFees}
              disabled={loading}
            />
          </div>

          {/* Current Configuration */}
          {config && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Current Configuration</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Base Fee:</span> ₹{config.base_fee}
                </div>
                <div>
                  <span className="font-medium">Commission Rate:</span> {config.commission_percentage}%
                </div>
                <div>
                  <span className="font-medium">Min Students:</span> {config.min_students}
                </div>
                <div>
                  <span className="font-medium">Min Fee per Student:</span> ₹{config.min_fee_per_student}
                </div>
                <div>
                  <span className="font-medium">Max Students:</span> {config.max_students}
                </div>
                <div>
                  <span className="font-medium">Beta Testing:</span> {config.beta_testing_free ? 'Free' : 'Paid'}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={fetchConfig} variant="outline" disabled={loading}>
              Refresh Config
            </Button>
            <Button 
              onClick={() => toggleBetaTesting(!betaTesting)} 
              disabled={loading}
              variant={betaTesting ? "destructive" : "default"}
            >
              {betaTesting ? 'Disable Beta Testing' : 'Enable Beta Testing'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionToggle;
