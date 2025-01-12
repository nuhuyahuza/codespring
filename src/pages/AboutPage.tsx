import { GraduationCap, Users, Globe, Award } from 'lucide-react';

export function AboutPage() {
  const stats = [
    { label: 'Active Students', value: '10,000+', icon: Users },
    { label: 'Course Completion Rate', value: '94%', icon: GraduationCap },
    { label: 'Countries', value: '150+', icon: Globe },
    { label: 'Success Stories', value: '5,000+', icon: Award },
  ];

  const values = [
    {
      title: 'Quality Education',
      description: 'We believe in providing top-notch educational content that is both comprehensive and practical.',
    },
    {
      title: 'Student Success',
      description: 'Our primary focus is on helping students achieve their career goals and personal aspirations.',
    },
    {
      title: 'Community',
      description: 'We foster a supportive learning environment where students can collaborate and grow together.',
    },
    {
      title: 'Innovation',
      description: 'We continuously update our curriculum to keep pace with the latest industry trends and technologies.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-foreground text-white py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Empowering the Next Generation of Developers
            </h1>
            <p className="text-xl text-white/90">
              At CodeSpring, we're dedicated to making high-quality coding education accessible to everyone. Our platform combines expert instruction with hands-on practice to help you master the skills that matter.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-2">{stat.value}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-muted-foreground">
              To democratize coding education by providing accessible, high-quality learning experiences that empower individuals to achieve their professional goals and contribute to the global tech community.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-card p-8 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Learning Community</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start your journey with CodeSpring today and join thousands of students who are transforming their careers through code.
          </p>
          <a
            href="/signup"
            className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg text-lg font-semibold hover:bg-primary/90"
          >
            Get Started Today
          </a>
        </div>
      </section>
    </div>
  );
} 