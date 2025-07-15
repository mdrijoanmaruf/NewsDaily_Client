import React, { useState, useEffect } from 'react'
import { 
  FaUsers, 
  FaNewspaper, 
  FaBuilding, 
  FaChartLine, 
  FaRegClock, 
  FaRegCalendarAlt, 
  FaRegBell, 
  FaExclamationTriangle,
  FaSearch,
  FaFilter,
  FaRegThumbsUp,
  FaRegEye,
  FaRegCommentDots,
  FaChartBar,
  FaChartPie,
  FaChartArea,
  FaUserCheck,
  FaUserPlus
} from 'react-icons/fa'
import { 
  MdTrendingUp, 
  MdNotificationsActive, 
  MdOutlineArticle 
} from 'react-icons/md'
import { 
  BiLineChart, 
  BiDotsVerticalRounded 
} from 'react-icons/bi'
import useAuth from '../../../Hook/useAuth'
import useAxiosSecure from '../../../Hook/useAxiosSecure'
import AOS from 'aos'
import { Chart } from 'react-google-charts'

const Dashboard = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const [stats, setStats] = useState({
    users: 0,
    articles: 0,
    publishers: 0,
    premiumUsers: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [publisherStats, setPublisherStats] = useState([])
  const [topArticlesData, setTopArticlesData] = useState([])
  const [userGrowthData, setUserGrowthData] = useState([])
  const [chartLoading, setChartLoading] = useState(true)
  const [chartError, setChartError] = useState(false)

  useEffect(() => {
    // Initialize AOS animation
    AOS.init({
      duration: 800,
      once: true,
    })

    // Fetch dashboard statistics
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        // Here you would actually fetch real data from your API
        // This is just placeholder data
        // Replace with actual API calls
        
        // Simulate API delay
        setTimeout(() => {
          setStats({
            users: 145,
            articles: 327,
            publishers: 24,
            premiumUsers: 78
          })
          setIsLoading(false)
        }, 500)

        // Example of how you would actually fetch data:
        // const response = await axiosSecure.get('/admin/stats')
        // setStats(response.data)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        setIsLoading(false)
      }
    }

    fetchStats()
    fetchPublisherArticleStats()
    fetchTopArticlesData()
    fetchUserGrowthData()
  }, [axiosSecure])

  // Fetch publisher article statistics
  const fetchPublisherArticleStats = async () => {
    try {
      setChartLoading(true)
      
      // In a real application, you would fetch this data from your API
      // For now, we'll use mock data
      
      // Fetch all articles
      const articlesResponse = await axiosSecure.get('/api/articles')
      const articles = articlesResponse.data?.data || []
      
      // Count articles by publisher
      const publisherCounts = {}
      let totalArticles = 0
      
      articles.forEach(article => {
        const publisherName = article.publisher || 'Unknown'
        publisherCounts[publisherName] = (publisherCounts[publisherName] || 0) + 1
        totalArticles++
      })
      
      // Convert to percentage and format for Google Charts
      const chartData = [['Publisher', 'Percentage']]
      
      Object.entries(publisherCounts).forEach(([publisher, count]) => {
        const percentage = (count / totalArticles) * 100
        chartData.push([publisher, percentage])
      })
      
      // If no data, provide sample data
      if (chartData.length === 1) {
        chartData.push(['Tech News', 35])
        chartData.push(['Sports Daily', 25])
        chartData.push(['Business Insider', 20])
        chartData.push(['Entertainment Weekly', 15])
        chartData.push(['Science Today', 5])
      }
      
      setPublisherStats(chartData)
      setChartLoading(false)
    } catch (error) {
      console.error('Error fetching publisher stats:', error)
      setChartError(true)
      
      // Provide sample data in case of error
      const sampleData = [
        ['Publisher', 'Percentage'],
        ['Tech News', 35],
        ['Sports Daily', 25],
        ['Business Insider', 20],
        ['Entertainment Weekly', 15],
        ['Science Today', 5]
      ]
      setPublisherStats(sampleData)
      setChartLoading(false)
    }
  }

  // Fetch top articles by views
  const fetchTopArticlesData = async () => {
    try {
      setChartLoading(true)
      
      // In a real application, you would fetch this data from your API
      // For now, we'll use mock data
      
      // Fetch all articles
      const articlesResponse = await axiosSecure.get('/api/articles')
      const articles = articlesResponse.data?.data || []
      
      // Sort articles by views and take top 5
      const sortedArticles = [...articles]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5)
      
      // Format for Google Charts
      const chartData = [['Article', 'Views']]
      
      sortedArticles.forEach((article, index) => {
        const title = article.title || `Article ${index + 1}`
        const views = article.views || Math.floor(Math.random() * 500) + 100
        chartData.push([title.substring(0, 20) + (title.length > 20 ? '...' : ''), views])
      })
      
      // If no data, provide sample data
      if (chartData.length === 1) {
        chartData.push(['AI Revolution in 2023', 845])
        chartData.push(['Climate Change Report', 732])
        chartData.push(['New Tech Gadgets Review', 651])
        chartData.push(['Sports Championship', 520])
        chartData.push(['Financial Market Update', 489])
      }
      
      setTopArticlesData(chartData)
      setChartLoading(false)
    } catch (error) {
      console.error('Error fetching top articles data:', error)
      setChartError(true)
      
      // Provide sample data in case of error
      const sampleData = [
        ['Article', 'Views'],
        ['AI Revolution in 2023', 845],
        ['Climate Change Report', 732],
        ['New Tech Gadgets Review', 651],
        ['Sports Championship', 520],
        ['Financial Market Update', 489]
      ]
      setTopArticlesData(sampleData)
      setChartLoading(false)
    }
  }

  // Fetch user growth data
  const fetchUserGrowthData = async () => {
    try {
      // In a real application, you would fetch this data from your API
      // For now, we'll use mock data
      
      // Generate last 6 months of data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth()
      
      // Format for Google Charts
      const chartData = [['Month', 'Regular Users', 'Premium Users']]
      
      // Generate last 6 months of data
      let regularUsers = 50
      let premiumUsers = 10
      
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12
        const monthName = months[monthIndex]
        
        // Generate some random growth
        regularUsers += Math.floor(Math.random() * 15) + 5
        premiumUsers += Math.floor(Math.random() * 8) + 2
        
        chartData.push([monthName, regularUsers, premiumUsers])
      }
      
      setUserGrowthData(chartData)
    } catch (error) {
      console.error('Error fetching user growth data:', error)
      setChartError(true)
      
      // Provide sample data in case of error
      const sampleData = [
        ['Month', 'Regular Users', 'Premium Users'],
        ['Jun', 65, 15],
        ['Jul', 73, 20],
        ['Aug', 85, 25],
        ['Sep', 102, 32],
        ['Oct', 120, 40],
        ['Nov', 145, 78]
      ]
      setUserGrowthData(sampleData)
    }
  }

  // Dashboard stat cards data
  const statCards = [
    {
      title: 'Total Users',
      value: stats.users,
      icon: FaUsers,
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      change: '+12%',
      changeType: 'increase',
      trendIcon: MdTrendingUp
    },
    {
      title: 'Total Articles',
      value: stats.articles,
      icon: MdOutlineArticle,
      color: 'bg-green-500',
      textColor: 'text-green-500',
      change: '+5%',
      changeType: 'increase',
      trendIcon: BiLineChart
    },
    {
      title: 'Publishers',
      value: stats.publishers,
      icon: FaBuilding,
      color: 'bg-purple-500',
      textColor: 'text-purple-500',
      change: '+3%',
      changeType: 'increase',
      trendIcon: MdTrendingUp
    },
    {
      title: 'Premium Users',
      value: stats.premiumUsers,
      icon: FaUserCheck,
      color: 'bg-amber-500',
      textColor: 'text-amber-500',
      change: '+15%',
      changeType: 'increase',
      trendIcon: BiLineChart
    }
  ]

  // Pie chart options
  const pieChartOptions = {
    title: 'Articles by Publisher (%)',
    titleTextStyle: {
      fontSize: 16,
      bold: true,
      color: '#333'
    },
    pieHole: 0.4,
    is3D: false,
    backgroundColor: 'transparent',
    legend: {
      position: 'right',
      alignment: 'center',
      textStyle: {
        fontSize: 12
      }
    },
    chartArea: {
      left: 10,
      top: 30,
      width: '100%',
      height: '75%'
    }
  }

  // Bar chart options
  const barChartOptions = {
    title: 'Top Articles by Views',
    titleTextStyle: {
      fontSize: 16,
      bold: true,
      color: '#333'
    },
    backgroundColor: 'transparent',
    legend: { position: 'none' },
    hAxis: {
      title: 'Views',
      minValue: 0,
    },
    vAxis: {
      title: 'Article',
    },
    chartArea: {
      left: 180,
      top: 30,
      width: '60%',
      height: '75%'
    },
    colors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#8430F0']
  }

  // Line chart options
  const lineChartOptions = {
    title: 'User Growth Trend',
    titleTextStyle: {
      fontSize: 16,
      bold: true,
      color: '#333'
    },
    backgroundColor: 'transparent',
    legend: { position: 'bottom' },
    hAxis: {
      title: 'Month',
    },
    vAxis: {
      title: 'Users',
      minValue: 0,
    },
    chartArea: {
      left: 60,
      top: 30,
      width: '80%',
      height: '65%'
    },
    colors: ['#4285F4', '#34A853']
  }

  // Fallback chart component for when Google Charts fails to load
  const FallbackChart = ({ title, type }) => (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="text-red-500 mb-2">
        <FaExclamationTriangle className="h-10 w-10" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">Unable to load {type} chart</h3>
      <p className="text-sm text-gray-500 text-center">
        There was an error loading the {title.toLowerCase()}. Please try refreshing the page.
      </p>
    </div>
  )

  return (
    <div className="p-6">
      {/* Dashboard Header */}
      <div className="mb-8" data-aos="fade-down">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to NewsDaily Dashboard</h1>
        <p className="mt-2 text-gray-600 flex items-center">
          <FaRegCalendarAlt className="mr-2 text-blue-500" />
          Hello, {user?.displayName || 'Admin'}! Here's what's happening with your platform today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = stat.trendIcon
          return (
            <div 
              key={stat.title}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10 flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                  <span className={`text-sm font-medium flex items-center ${stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                    <TrendIcon className="ml-1 h-4 w-4" />
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {isLoading ? (
                    <div className="h-7 w-16 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    stat.value.toLocaleString()
                  )}
                </h3>
                <p className="text-sm text-gray-500">{stat.title}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Publisher Distribution Pie Chart */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden" data-aos="fade-right">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FaChartPie className="mr-2 text-purple-500" /> Publisher Distribution
            </h3>
            <div className="flex space-x-2">
              <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
                <FaFilter className="h-4 w-4" />
              </button>
              <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
                <BiDotsVerticalRounded className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="p-4 h-80">
            {chartLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : chartError ? (
              <FallbackChart title="Publisher Distribution" type="pie" />
            ) : (
              <div className="h-full">
                {publisherStats.length > 1 && (
                  <Chart
                    chartType="PieChart"
                    data={publisherStats}
                    options={pieChartOptions}
                    width="100%"
                    height="100%"
                    loader={<div className="flex items-center justify-center h-full">Loading Chart...</div>}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* User Growth Line Chart */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden" data-aos="fade-left">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FaChartArea className="mr-2 text-blue-500" /> User Growth Trend
            </h3>
            <div className="flex space-x-2">
              <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
                <FaFilter className="h-4 w-4" />
              </button>
              <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
                <BiDotsVerticalRounded className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="p-4 h-80">
            {chartLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : chartError ? (
              <FallbackChart title="User Growth Trend" type="line" />
            ) : (
              <div className="h-full">
                {userGrowthData.length > 1 && (
                  <Chart
                    chartType="LineChart"
                    data={userGrowthData}
                    options={lineChartOptions}
                    width="100%"
                    height="100%"
                    loader={<div className="flex items-center justify-center h-full">Loading Chart...</div>}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Articles Bar Chart */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden" data-aos="fade-right" data-aos-delay="100">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FaChartBar className="mr-2 text-green-500" /> Top Articles
            </h3>
            <div className="flex space-x-2">
              <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
                <FaFilter className="h-4 w-4" />
              </button>
              <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
                <BiDotsVerticalRounded className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="p-4 h-96">
            {chartLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : chartError ? (
              <FallbackChart title="Top Articles" type="bar" />
            ) : (
              <div className="h-full">
                {topArticlesData.length > 1 && (
                  <Chart
                    chartType="BarChart"
                    data={topArticlesData}
                    options={barChartOptions}
                    width="100%"
                    height="100%"
                    loader={<div className="flex items-center justify-center h-full">Loading Chart...</div>}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden" data-aos="fade-left" data-aos-delay="100">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <MdNotificationsActive className="mr-2 text-amber-500" /> Recent Activity
            </h3>
            <div className="flex space-x-2">
              <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
                <FaRegBell className="h-4 w-4" />
              </button>
              <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
                <BiDotsVerticalRounded className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {isLoading ? (
                // Loading state
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))
              ) : (
                // Actual content
                <>
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaUserPlus className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">New user registration</p>
                      <p className="text-sm text-gray-500">Jane Smith joined the platform</p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center">
                        <FaRegClock className="mr-1" /> 2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <FaNewspaper className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">New article published</p>
                      <p className="text-sm text-gray-500">Tech Trends 2023: AI Revolution</p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center">
                        <FaRegClock className="mr-1" /> 5 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <FaChartLine className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">New premium subscription</p>
                      <p className="text-sm text-gray-500">Michael Johnson upgraded to premium</p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center">
                        <FaRegClock className="mr-1" /> 1 day ago
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard