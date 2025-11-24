'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TeamMember } from '@/lib/types';
import Link from 'next/link';
import { toPng } from 'html-to-image';
import QRCode from 'qrcode';

interface BusinessCard3DProps {
  member: TeamMember;
  isPreview?: boolean;
  showDownloadButton?: boolean;
}

export default function BusinessCard3D({ member, isPreview = false, showDownloadButton = false }: BusinessCard3DProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const downloadCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // QR 코드 생성 (멤버 페이지로 연결)
    const memberUrl = `${window.location.origin}/member/${member.id}`;
    QRCode.toDataURL(memberUrl, {
      width: 120,
      margin: 1,
      color: {
        dark: '#1E3A8A',
        light: '#FFFFFF'
      }
    }).then(setQrCodeUrl).catch(console.error);
  }, [member.id]);

  const handleDownload = async () => {
    if (!downloadCardRef.current) return;
    
    setIsDownloading(true);
    try {
      // 잠시 기다려서 DOM이 완전히 렌더링되도록 함
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await toPng(downloadCardRef.current, {
        quality: 1,
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: '#ffffff',
        style: {
          transform: 'none',
          position: 'relative',
        }
      });
      
      const link = document.createElement('a');
      link.download = `${member.name}-business-card.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to download card:', error);
      alert('명함 다운로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

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
          rotateX: isFlipped ? 180 : (rotateX || 5),
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
        {/* Front of card - businessCard 4-1 스타일 */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl backface-hidden overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            background: '#FFFFFF',
          }}
        >
          {/* Left gradient line - 위로 향함 (아래에서 위로 투명해짐) */}
          <svg className="absolute left-2 top-0 h-full" width="2" viewBox="0 0 2 351" fill="none" preserveAspectRatio="none">
            <path d="M0 1C0 0.447715 0.447715 0 1 0C1.55228 0 2 0.447715 2 1H1H0ZM1 351H0V1H1H2V351H1Z" fill="url(#paint0_linear_left)"/>
            <defs>
              <linearGradient id="paint0_linear_left" x1="0.5" y1="351" x2="0.5" y2="1" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0077FF"/>
                <stop offset="1" stopColor="#0077FF" stopOpacity="0"/>
              </linearGradient>
            </defs>
          </svg>

          {/* Right gradient line - 아래로 향함 (위에서 아래로 투명해짐) */}
          <svg className="absolute right-2 top-0 h-full" width="2" viewBox="0 0 2 351" fill="none" preserveAspectRatio="none" style={{ transform: 'rotate(180deg)' }}>
            <path d="M0 1C0 0.447715 0.447715 0 1 0C1.55228 0 2 0.447715 2 1H1H0ZM1 351H0V1H1H2V351H1Z" fill="url(#paint0_linear_right)"/>
            <defs>
              <linearGradient id="paint0_linear_right" x1="0.5" y1="351" x2="0.5" y2="1" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0077FF"/>
                <stop offset="1" stopColor="#0077FF" stopOpacity="0"/>
              </linearGradient>
            </defs>
          </svg>

          <div className="relative h-full p-5 flex justify-between">
            {/* Left Content */}
            <div className="flex flex-col justify-center">
              {/* Role */}
              <p className="text-[#2196F3] text-sm italic font-medium mb-1">
                {member.role}
              </p>

              {/* Name */}
              <div className="flex items-baseline gap-2 mb-4">
                <h3 className="text-[#1a1a1a] text-2xl font-black tracking-tight">
                  {member.name}
                </h3>
                <span className="text-gray-500 text-sm">
                  {member.nameEn}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                {/* Phone */}
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#1a1a1a]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <span className="text-xs text-[#1a1a1a]">{member.phone}</span>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#1a1a1a]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <span className="text-xs text-[#1a1a1a]">{member.email}</span>
                </div>

                {/* GitHub */}
                {member.social.github && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#1a1a1a]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span className="text-xs text-[#1a1a1a]">{member.social.github}</span>
                  </div>
                )}

                {/* Instagram */}
                {member.social.instagram && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#1a1a1a]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span className="text-xs text-[#1a1a1a]">{member.social.instagram}</span>
                  </div>
                )}

                {/* Discord */}
                {member.social.discord && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#1a1a1a]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                    </svg>
                    <span className="text-xs text-[#1a1a1a]">{member.social.discord}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section - Vertical Line and PALETTO Logo */}
            <div className="flex items-center gap-3 pr-2">
              {/* Vertical Line */}
              <div className="w-0.5 h-3/4 bg-[#2196F3]" />

              {/* PALETTO Logo - Rotated */}
              <div
                className="text-[#2196F3] text-2xl font-black tracking-wider"
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                }}
              >
                PALETTO
              </div>
            </div>
          </div>
        </div>

        {/* Back of card - businessCard 4 스타일 */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl backface-hidden overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateX(180deg)',
            background: '#FFFFFF',
            border: 'none',
            boxShadow: 'none',
          }}
        >
          <div className="h-full flex">
            {/* Left Vertical Line */}
            <div className="w-1 h-full bg-[#2196F3]" />

            {/* Center Content */}
            <div className="flex-1 flex flex-col items-center justify-center">
              {/* PALETTO Logo */}
              <h2 className="text-[#2196F3] text-3xl font-black tracking-wider">
                PALETTO
              </h2>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // 다운로드용 카드 (businessCard 4-1 디자인)
  const DownloadCard = (
    <div
      ref={downloadCardRef}
      style={{
        position: 'fixed',
        top: '-9999px',
        left: '0',
        width: '600px',
        height: '337.5px',
        zIndex: -9999
      }}
    >
      <div
        style={{
          width: '600px',
          height: '337.5px',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: '#FFFFFF',
        }}
      >
        <div style={{
          position: 'relative',
          height: '100%',
          padding: '40px 50px',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          {/* Left Content */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '8px'
          }}>
            {/* Role */}
            <p style={{
              color: '#2196F3',
              fontSize: '18px',
              fontStyle: 'italic',
              fontWeight: '500',
              marginBottom: '4px'
            }}>
              {member.role}
            </p>

            {/* Name */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <h3 style={{
                color: '#1a1a1a',
                fontSize: '42px',
                fontWeight: '900',
                letterSpacing: '-1px',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                {member.name}
              </h3>
              <span style={{
                color: '#666666',
                fontSize: '18px',
                fontWeight: '400'
              }}>
                {member.nameEn}
              </span>
            </div>

            {/* Contact Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Phone */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <svg style={{ width: '20px', height: '20px', color: '#1a1a1a' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <span style={{ fontSize: '16px', color: '#1a1a1a', fontFamily: 'system-ui, -apple-system, sans-serif' }}>{member.phone}</span>
              </div>

              {/* Email */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <svg style={{ width: '20px', height: '20px', color: '#1a1a1a' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span style={{ fontSize: '16px', color: '#1a1a1a', fontFamily: 'system-ui, -apple-system, sans-serif' }}>{member.email}</span>
              </div>

              {/* GitHub */}
              {member.social.github && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <svg style={{ width: '20px', height: '20px', color: '#1a1a1a' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span style={{ fontSize: '16px', color: '#1a1a1a', fontFamily: 'system-ui, -apple-system, sans-serif' }}>{member.social.github}</span>
                </div>
              )}

              {/* Instagram */}
              {member.social.instagram && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <svg style={{ width: '20px', height: '20px', color: '#1a1a1a' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span style={{ fontSize: '16px', color: '#1a1a1a', fontFamily: 'system-ui, -apple-system, sans-serif' }}>{member.social.instagram}</span>
                </div>
              )}

              {/* Discord */}
              {member.social.discord && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <svg style={{ width: '20px', height: '20px', color: '#1a1a1a' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                  </svg>
                  <span style={{ fontSize: '16px', color: '#1a1a1a', fontFamily: 'system-ui, -apple-system, sans-serif' }}>{member.social.discord}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Vertical Line and PALETTO Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            paddingRight: '10px'
          }}>
            {/* Vertical Line */}
            <div style={{
              width: '2px',
              height: '70%',
              backgroundColor: '#2196F3'
            }} />

            {/* PALETTO Logo - Rotated */}
            <div style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              fontSize: '48px',
              fontWeight: '900',
              color: '#2196F3',
              letterSpacing: '4px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              PALETTO
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isPreview) {
    return (
      <>
        {DownloadCard}
        <Link href={`/member/${member.id}`} className="block">
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="card-shadow rounded-2xl"
          >
            {CardContent}
          </motion.div>
        </Link>
      </>
    );
  }

  return (
    <>
      {DownloadCard}
      <div className="space-y-4">
        {showDownloadButton && (
          <motion.button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full py-3 px-4 bg-gradient-to-r from-paletto-sky to-paletto-sky-light text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isDownloading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>다운로드 중...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>명함 다운로드</span>
              </>
            )}
          </motion.button>
        )}
        <div className="card-shadow rounded-2xl">
          {CardContent}
        </div>
      </div>
    </>
  );
}
