'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BusinessCard3D from '@/components/BusinessCard3D';
import { TeamMember } from '@/lib/types';
import { fetchMembers } from '@/lib/api';

export default function Home() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers()
      .then((data) => {
        setMembers(data);
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error('Failed to fetch members:', err);
        setError('데이터를 불러오는데 실패했습니다');
        setIsLoaded(true);
      });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">PALETTO</span>
              <br />
              <span className="text-gray-700 text-2xl md:text-3xl font-medium mt-2 block">
                Digital Business Cards
              </span>
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              창의적인 아이디어와 기술로 새로운 가치를 만들어가는
              <br className="hidden md:block" />
              PALETTO 팀을 소개합니다
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Cards Section */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Our Team</h2>
            <p className="text-gray-500">카드를 클릭해서 더 자세한 정보를 확인하세요</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {!isLoaded ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[1.8/1] rounded-2xl bg-white/50 animate-pulse" />
              ))
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <p className="text-red-500">{error}</p>
              </div>
            ) : members.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">아직 등록된 팀원이 없습니다</p>
              </div>
            ) : (
              members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1 * index,
                  duration: 0.5,
                  type: 'spring',
                  stiffness: 100,
                }}
              >
                <BusinessCard3D member={member} isPreview={true} />
              </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold gradient-text mb-6">About PALETTO</h2>
            <p className="text-gray-600 leading-relaxed">
              PALETTO는 다양한 색깔의 재능이 모여 하나의 아름다운 그림을 그리는 팀입니다.
              <br />
              우리는 혁신적인 기술과 창의적인 디자인으로 사용자에게 최고의 경험을 제공합니다.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
