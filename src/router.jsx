import { createBrowserRouter, Navigate } from "react-router-dom";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Notifications from "./pages/Notifications";
import MyTransactions from "./pages/MyTransactions";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/Dashboard"
import { useAuth } from "./context/AuthContext";
import MyProperties from "./components/MyProperties";
import OwnerDashboard from "./pages/OwnerDashboard";
import GroupPayment from "./pages/GroupPayment";
import CreateProperty from "./pages/CreateProperty";
import Navbar from './components/Navbar';
import BuyerDashboard from "./pages/BuyerDashboard";
import PaymentPage from "./pages/PaymentPage"
import PaymentSuccess from "./pages/PaymentSuccess";
import GroupInterestPage from "./pages/GroupInterestPage";
import GroupPaymentInvitesPage from "./pages/GroupPaymentInvitesPage";
import InviteMembersPage from "./pages/InviteMembersPage";
import GroupInvitePage from "./pages/GroupInvitePage";
import WalletDashboard from "./pages/Wallet-Dashboard";
import CommitteeList from "./pages/CommitteeList";
import CommitteeDetail from "./pages/CommitteeDetail";
import MyCommittees from "./pages/MyCommittees";
import JoinSuccess from "./pages/JoinSuccess";
import PaymentStatus from "./pages/PaymentStatus";
import PaymentHistory from "./pages/PaymentHistory";
import AllPaymentPage from "./pages/AllPaymentPage";
import Home from "./pages/Home";
import LoanDashboard from "./pages/LoanDashboard";
import LoanEligibility from "./pages/LoanEligibility";
import LoanApproved from "./pages/LoanApproved";
import LoanRejected from "./pages/LoanRejected";
import LoanApplicationStatus from "./pages/LoanApplicationStatus";
import MyLoans from "./pages/MyLoans";
import LoanDetails from "./pages/LoanDetails";
import CommitteeHistory from "./pages/CommitteeHistory";
import CommitteePayment from "./pages/CommitteePayment";
import Profile from "./pages/Profile"
import Wallet from "./pages/Wallet";
import ProfileKYC from "./pages/ProfileKYC";
import ReferralCard from "./pages/ReferralCard";
import MainLayout from "./layouts/MainLayout";
import MyPropertiesPage from "./pages/MyPropertiesPage";
import EditPropertyPage from "./pages/EditPropertyPage";
import PropertyRequestForm from "./pages/PropertyRequestForm";
import MyPropertyRequests from "./pages/MyPropertyRequests";
import CommitteeWithdraw from "./pages/CommitteeWithdraw";
import WithdrawPage from "./pages/WithdrawPage";




/* 🔐 Protected Route */
const Protected = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p>Checking session...</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

export const router = createBrowserRouter([

   { path: "/login", element: <LoginForm /> },
  { path: "/register", element: <RegisterForm /> },

   {
    path: "/",
    element: <MainLayout />,   // 👈 NAVBAR ATTACHED HERE
    children: [

  
  { path: "/", element: <Properties /> },

 

  {
    path: "/dashboard",
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
  },

  {
    path: "/committees",
    element: (
      
        <CommitteeList />
      
    ),
  },


 {
    path: "/home",
    element: (
        <Home />
    ),
  },

  {
    path: "/loans",
    element: (
      <Protected>
        <LoanDashboard />
      </Protected>
    ),
  },

 {
    path: "/property/:propertyId/request",
    element: (
      <Protected>
        <PropertyRequestForm />
      </Protected>
    ),
  },




   {
    path: "/my-requests",
    element: (
      <Protected>
        <MyPropertyRequests/>
      </Protected>
    ),
  },


 {
    path: "/committee/:userCommitteeId/withdraw",
    element: (
      <Protected>
        <CommitteeWithdraw/>
      </Protected>
    ),
  },
  

 {
    path: "/my-properties",
    element: (
      <Protected>
        <MyPropertiesPage />
      </Protected>
    ),
  },


  {
    path: "/properties/edit/:id",
    element: (
      <Protected>
        <EditPropertyPage />
      </Protected>
    ),
  },


{
    path: "/wallet",
    element: (
      <Protected>
        <Wallet />
      </Protected>
    ),
  },

  {
    path: "/profile-kyc",
    element: (
      <Protected>
        <ProfileKYC />
      </Protected>
    ),
  },


{
    path: "/referral",
    element: (
      <Protected>
        <ReferralCard />
      </Protected>
    ),
  },


{
    path: "/loan-eligibility",
    element: (
      <Protected>
        <LoanEligibility />
      </Protected>
    ),
  },


  {
    path: "/loan-approved",
    element: (
      <Protected>
        <LoanApproved />
      </Protected>
    ),
  },


  {
    path: "/loan-rejected",
    element: (
      <Protected>
        <LoanRejected />
      </Protected>
    ),
  },


  {
    path: "/profile",
    element: (
      <Protected>
        <Profile />
      </Protected>
    ),
  },






  {
    path: "/loan-application-status",
    element: (
      <Protected>
        <LoanApplicationStatus />
      </Protected>
    ),
  },



  {
    path: "/my-loans",
    element: (
      <Protected>
        <MyLoans />
      </Protected>
    ),
  },

  {
    path: "/loan-details",
    element: (
      <Protected>
        <LoanDetails />
      </Protected>
    ),
  },


{
    path: "/payment-status/:paymentId",
    element: (
      <Protected>
        <PaymentStatus />
      </Protected>
    ),
  },

  {
    path: "/payment-history",
    element: (
      <Protected>
        <PaymentHistory />
      </Protected>
    ),
  },

 {
    path: "/pay",
    element: (
      <Protected>
        <AllPaymentPage />
      </Protected>
    ),
  },




   {
    path: "/payment-history/:userCommitteeId",
    element: (
      <Protected>
        <CommitteeHistory />
      </Protected>
    ),
  },

 {
    path: "/pay/:userCommitteeId",
    element: (
      <Protected>
        <CommitteePayment />
      </Protected>
    ),
  },




  {
    path: "/my-committee/:userCommitteeId",
    element: (
      <Protected>
        <CommitteeDetail />
      </Protected>
    ),
  },

  {
    path: "/my-committees",
    element: (
      <Protected>
        <MyCommittees />
      </Protected>
    ),
  },


  {
    path: "/join-success/:committeeId",
    element: (
      <Protected>
        <JoinSuccess />
      </Protected>
    ),
  },

  {
    path: "/wallet-dashboard",
    element: (
      <Protected>
        <WalletDashboard />
      </Protected>
    ),
  },

  {
    path: "/dashboard",
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
  },

  {
    path: "/grouppayment",
    element: (
      <Protected>
        <GroupPayment />
      </Protected>
    ),
  },
  {
  path: "/group-payment-invites",
  element: (
    <Protected>
      <GroupPaymentInvitesPage />
    </Protected>
  ),
},

 {
  path: "/group-invite/:inviteId",
  element: (
    <Protected>
      <GroupInvitePage />
    </Protected>
  ),
},

  {
    path: "/ownerdashboard",
    element: (
      <Protected>
        <OwnerDashboard />
      </Protected>
    ),
  },

  {
    path: "/createproperty",
    element: (
      <Protected>
        <CreateProperty />
      </Protected>
    ),
  },


  {
    path: "/notifications",
    element: (
      <Protected>
        <Notifications />
      </Protected>
    ),
  },

  {
  path: "/group-interest/:propertyId",
  element: (
    <Protected>
      <GroupInterestPage />
    </Protected>
  ),
},


  { path: "/payment-success/:planId", element: <PaymentSuccess /> },

  {
    path: "/myproperty",
    element: (
      <Protected>
        <MyProperties />
      </Protected>
    ),
  },

  {
    path: "/withdraw",
    element: (
      <Protected>
        <WithdrawPage />
      </Protected>
    ),
  },

  {
    path: "/buyer-dashboard",
    element: (
      <Protected>
        <BuyerDashboard />
      </Protected>
    ),
  },

  {
    path: "/payment/:planId",
    element: (
      <Protected>
        <PaymentPage />
      </Protected>
    ),
  },

{
    path: "invite-members/:planId",
    element: (
      <Protected>
        <InviteMembersPage />
      </Protected>
    ),
  },



  {
    path: "/transactions",
    element: (
      <Protected>
        <MyTransactions />
      </Protected>
    ),
  },

  { path: "/property/:id", element: <PropertyDetail /> },

  /* 🔥 Catch-all */
  { path: "*", element: <Navigate to="/" replace /> },
  ],
  },
]);
