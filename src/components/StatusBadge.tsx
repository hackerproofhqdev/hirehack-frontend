import { Crown, Settings, Shield } from "lucide-react";

export const StatusBadge = ({ status } :{ status:string }) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case 'active':
        return {
          colors: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
          icon: <Crown className="w-4 h-4 text-emerald-500" />
        };
      case 'cancelled':
        return {
          colors: 'bg-red-500/10 text-red-500 border-red-500/20',
          icon: <Shield className="w-4 h-4 text-red-500" />
        };
      default:
        return {
          colors: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
          icon: <Settings className="w-4 h-4 text-gray-400" />
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2 ${config.colors}`}>
      {config.icon}
      {status || 'Free Trial'}
    </span>
  );
};