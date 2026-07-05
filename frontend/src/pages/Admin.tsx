import { Users, AlertTriangle, Activity } from 'lucide-react';

export default function Admin() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-3xl font-semibold text-slate-100 mb-8">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-3xl p-6 border-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-slate-300">Total Users</h3>
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-100">12,450</p>
          <p className="text-sm text-emerald-400 mt-2">+120 this week</p>
        </div>

        <div className="glass-card rounded-3xl p-6 border-amber-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-slate-300">Premium Subs</h3>
            <div className="p-2 bg-amber-500/20 rounded-xl">
              <Activity className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-100">3,200</p>
          <p className="text-sm text-emerald-400 mt-2">+45 this week</p>
        </div>

        <div className="glass-card rounded-3xl p-6 border-red-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-slate-300">Pending Reports</h3>
            <div className="p-2 bg-red-500/20 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-100">18</p>
          <p className="text-sm text-red-400 mt-2">Requires attention</p>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <h3 className="text-xl font-semibold text-slate-100 mb-6">Recent Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700/50 text-slate-400">
                <th className="py-3 px-4 font-medium">Name</th>
                <th className="py-3 px-4 font-medium">Email</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Joined</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'John Smith', email: 'john@example.com', status: 'Premium', date: '2 mins ago' },
                { name: 'Sarah Connor', email: 'sarah@example.com', status: 'Free', date: '1 hour ago' },
                { name: 'Mike Ross', email: 'mike@example.com', status: 'Premium', date: '3 hours ago' },
              ].map((user, i) => (
                <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                  <td className="py-4 px-4 text-slate-200">{user.name}</td>
                  <td className="py-4 px-4 text-slate-400">{user.email}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'Premium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-700 text-slate-300'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-500 text-sm">{user.date}</td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
