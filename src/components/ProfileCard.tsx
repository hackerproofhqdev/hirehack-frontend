import { Card, CardContent } from "./ui/card";

const ProfileCard = ({ icon: Icon, title, items }) => (
  <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-colors">
    <CardContent className="p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-emerald-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={index} className="bg-gray-700/30 p-4 rounded-xl hover:bg-gray-700/40 transition-colors">
            <p className="text-sm text-gray-400 mb-2">{item.label}</p>
            <div className="flex items-center gap-2">
              {item.icon}
              <p className="text-white text-lg">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default ProfileCard;