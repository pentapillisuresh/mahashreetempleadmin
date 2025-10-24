import React, { useState, useMemo } from "react";

const AdminContacts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState(null);

  const contactData = [
    {
      id: 1,
      name: "Ravi Kumar",
      email: "ravi@example.com",
      phone: "+91 98765 43210",
      address: "Noida, Uttar Pradesh, India",
      message: "I would like to volunteer for temple services.",
      date: "2025-10-22",
      status: "new",
    },
    {
      id: 2,
      name: "Suresh Patel",
      email: "suresh.patel@example.com",
      phone: "+91 91234 56789",
      address: "Hyderabad, Telangana, India",
      message: "Please share donation details.",
      date: "2025-10-21",
      status: "replied",
    },
    {
      id: 3,
      name: "Anjali Sharma",
      email: "anjali.s@example.com",
      phone: "+91 99887 66554",
      address: "Delhi, India",
      message: "Loved the temple visit experience.",
      date: "2025-10-20",
      status: "pending",
    },
    {
      id: 4,
      name: "Rajesh Verma",
      email: "rajesh.v@example.com",
      phone: "+91 98765 12345",
      address: "Mumbai, Maharashtra, India",
      message: "Inquiry about wedding ceremonies.",
      date: "2025-10-19",
      status: "new",
    },
  ];

  // Filter and search logic
  const filteredContacts = useMemo(() => {
    return contactData.filter((contact) => {
      const matchesSearch = 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm) ||
        contact.message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
      
      const contactDate = new Date(contact.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let matchesDate = true;
      if (dateFilter === "today") {
        matchesDate = contactDate.toDateString() === today.toDateString();
      } else if (dateFilter === "yesterday") {
        matchesDate = contactDate.toDateString() === yesterday.toDateString();
      } else if (dateFilter === "week") {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchesDate = contactDate >= weekAgo;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [searchTerm, statusFilter, dateFilter]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: "bg-blue-100 text-blue-800 border border-blue-200",
      replied: "bg-green-100 text-green-800 border border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const updateContactStatus = (contactId, newStatus) => {
    console.log(`Updating contact ${contactId} status to ${newStatus}`);
    alert(`Status updated for contact ${contactId} to ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mx-auto max-w-full">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 pb-4 border-b">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 lg:mb-0">
            Contact Form Submissions
          </h1>
          
          <div className="w-full lg:w-64">
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
          <div className="flex-1 min-w-[140px]">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="replied">Replied</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="flex-1 min-w-[140px]">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Date</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 Days</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setDateFilter("all");
              }}
              className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredContacts.length} of {contactData.length} contacts
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{contact.name}</div>
                          <div className="text-sm text-gray-500">{contact.email}</div>
                          <div className="text-sm text-gray-500">{contact.phone}</div>
                          <div className="text-sm text-gray-500 truncate max-w-[200px]" title={contact.address}>
                            {contact.address}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="max-w-[250px]">
                          <div className="text-sm text-gray-900 line-clamp-2" title={contact.message}>
                            {contact.message}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contact.date}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getStatusBadge(contact.status)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <select
                          value={contact.status}
                          onChange={(e) => updateContactStatus(contact.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="new">New</option>
                          <option value="replied">Replied</option>
                          <option value="pending">Pending</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500 text-sm">
                      No contacts found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards View */}
        <div className="lg:hidden space-y-4">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div key={contact.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-500">{contact.email}</p>
                    <p className="text-sm text-gray-500">{contact.phone}</p>
                  </div>
                  {getStatusBadge(contact.status)}
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Address:</span> {contact.address}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Message:</span> {contact.message}
                  </p>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{contact.date}</span>
                  <select
                    value={contact.status}
                    onChange={(e) => updateContactStatus(contact.id, e.target.value)}
                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="replied">Replied</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              No contacts found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContacts;