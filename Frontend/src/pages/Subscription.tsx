import { useState, useEffect } from 'react';
import Hnavbar from "../components/NavbarPage/Hnavbar";
import Vnavbar from "../components/NavbarPage/Vnavbar";
import axios from 'axios';
import { Check, Crown, Star, Zap, Shield } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  limitations: string[];
}

interface UserSubscription {
  subscriptionType: string;
  subscriptionStart: string;
  subscriptionEnd: string;
  isActive: boolean;
  daysRemaining: number | null;
}

const Subscription = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
    fetchUserSubscription();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get('/api/v1/subscription/plans');
      setPlans(response.data.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const fetchUserSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/subscription/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserSubscription(response.data.data);
    } catch (error) {
      console.error('Error fetching user subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/v1/subscription/user', 
        { subscriptionType: planId.toUpperCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUserSubscription();
      setSelectedPlan(null);
    } catch (error) {
      console.error('Error upgrading subscription:', error);
    }
  };

  const handleCancel = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('/api/v1/subscription/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUserSubscription();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return <Shield className="h-6 w-6" />;
      case 'basic': return <Zap className="h-6 w-6" />;
      case 'pro': return <Star className="h-6 w-6" />;
      case 'enterprise': return <Crown className="h-6 w-6" />;
      default: return <Shield className="h-6 w-6" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'free': return 'border-gray-300';
      case 'basic': return 'border-blue-500';
      case 'pro': return 'border-purple-500';
      case 'enterprise': return 'border-yellow-500';
      default: return 'border-gray-300';
    }
  };

  const getPlanBgColor = (planId: string) => {
    switch (planId) {
      case 'free': return 'bg-gray-50';
      case 'basic': return 'bg-blue-50';
      case 'pro': return 'bg-purple-50';
      case 'enterprise': return 'bg-yellow-50';
      default: return 'bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading subscription plans...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Vnavbar className="fixed top-0 left-0 h-[calc(100vh-0.5rem)] mt-1 ml-1" />
      <div className="ml-[16.5rem] mr-1">
        <Hnavbar className="mt-1" />
        <main className="mt-1 ml-1 mr-1 p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Plan</h1>
            <p className="text-gray-600">Select the perfect plan for your coding analytics needs</p>
          </div>

          {/* Current Subscription Status */}
          {userSubscription && (
            <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Current Subscription</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Plan: <span className="font-medium text-gray-900">{userSubscription.subscriptionType}</span></p>
                  <p className="text-sm text-gray-600">Status: <span className={`font-medium ${userSubscription.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {userSubscription.isActive ? 'Active' : 'Inactive'}
                  </span></p>
                  {userSubscription.daysRemaining && (
                    <p className="text-sm text-gray-600">Days Remaining: <span className="font-medium text-gray-900">{userSubscription.daysRemaining}</span></p>
                  )}
                </div>
                {userSubscription.subscriptionType !== 'FREE' && (
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Cancel Subscription
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Subscription Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-lg border-2 p-6 shadow-sm ${getPlanColor(plan.id)} ${
                  userSubscription?.subscriptionType === plan.id.toUpperCase() ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {userSubscription?.subscriptionType === plan.id.toUpperCase() && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${getPlanBgColor(plan.id)}`}>
                      {getPlanIcon(plan.id)}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    ${plan.price}
                    <span className="text-sm font-normal text-gray-500">/month</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-gray-900">Features:</h4>
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.limitations.length > 0 && (
                  <div className="space-y-3 mb-6">
                    <h4 className="font-semibold text-gray-900">Limitations:</h4>
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="h-4 w-4 text-red-500 flex-shrink-0">×</div>
                        <span className="text-sm text-gray-500">{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={userSubscription?.subscriptionType === plan.id.toUpperCase()}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    userSubscription?.subscriptionType === plan.id.toUpperCase()
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : plan.id === 'free'
                      ? 'bg-gray-500 text-white hover:bg-gray-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {userSubscription?.subscriptionType === plan.id.toUpperCase()
                    ? 'Current Plan'
                    : plan.id === 'free'
                    ? 'Downgrade'
                    : 'Upgrade'}
                </button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">Can I change my plan anytime?</h3>
                <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">What happens to my data when I downgrade?</h3>
                <p className="text-gray-600">Your existing data is preserved, but you'll only have access to the data retention period of your new plan.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Is there a free trial?</h3>
                <p className="text-gray-600">Yes, all paid plans come with a 7-day free trial. You can cancel anytime during the trial period.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Subscription; 