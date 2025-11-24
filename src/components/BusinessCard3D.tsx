'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { TeamMember } from '@/lib/types';
import Link from 'next/link';

interface BusinessCard3DProps {
  member: TeamMember;
  isPreview?: boolean;
}

export default function BusinessCard3D({ member, isPreview = false }: BusinessCard3DProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isPreview) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateXValue = (mouseY / (rect.height / 2)) * -15;
    const rotateYValue = (mouseX / (rect.width / 2)) * 15;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleClick = () => {
    if (!isPreview) {
      setIsFlipped(!isFlipped);
    }
  };

  const CardContent = (
    <div
      ref={cardRef}
      className="relative w-full aspect-[1.8/1] cursor-pointer preserve-3d"
      style={{
        perspective: '1000px',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <motion.div
        className="w-full h-full preserve-3d"
        animate={{
          rotateX: isFlipped ? 180 : rotateX,
          rotateY: isFlipped ? 0 : rotateY,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front of card */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl backface-hidden overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            background: `linear-gradient(135deg, ${member.gradientFrom} 0%, ${member.gradientTo} 100%)`,
          }}
        >
          <div className="absolute inset-0 bg-white/20 shimmer" />
          <div className="relative h-full p-6 flex flex-col justify-between">
            {/* Top section */}
            <div className="flex items-start justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-2xl mb-3">
                  {member.avatar}
                </div>
                <h3 className="text-white text-xl font-bold drop-shadow-sm">
                  {member.name}
                </h3>
                <p className="text-white/80 text-sm">
                  {member.nameEn}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
            </div>

            {/* Bottom section */}
            <div>
              <p className="text-white font-medium text-sm">
                {member.role}
              </p>
              <p className="text-white/70 text-xs">
                {member.department}
              </p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/10" />
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl backface-hidden overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateX(180deg)',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FBFF 100%)',
          }}
        >
          <div className="h-full p-6 flex flex-col justify-between">
            {/* Contact info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-paletto-sky-dark">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-gray-600">{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-paletto-sky-dark">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-xs text-gray-600">{member.phone}</span>
              </div>
            </div>

            {/* Skills */}
            <div>
              <div className="flex flex-wrap gap-1">
                {member.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 text-xs rounded-full bg-paletto-sky/20 text-paletto-sky-dark"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* PALETTO branding */}
            <div className="flex justify-between items-end">
              <span className="text-xs text-gray-400">Click to flip</span>
              <span className="text-sm font-bold gradient-text">PALETTO</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  if (isPreview) {
    return (
      <Link href={`/member/${member.id}`} className="block">
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="card-shadow rounded-2xl"
        >
          {CardContent}
        </motion.div>
      </Link>
    );
  }

  return (
    <div className="card-shadow rounded-2xl">
      {CardContent}
    </div>
  );
}
