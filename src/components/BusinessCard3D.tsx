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

  // 다운로드용 카드 (QR 코드 포함, 숨김 처리)
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
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          background: `linear-gradient(135deg, ${member.gradientFrom} 0%, ${member.gradientTo} 100%)`,
        }}
      >
        <div style={{ 
          position: 'relative', 
          height: '100%', 
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          {/* Top section */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                marginBottom: '16px'
              }}>
                {member.avatar}
              </div>
              <h3 style={{ 
                color: 'white', 
                fontSize: '30px', 
                fontWeight: 'bold',
                marginBottom: '4px',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {member.name}
              </h3>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                fontSize: '18px',
                marginBottom: '8px'
              }}>
                {member.nameEn}
              </p>
              <p style={{ 
                color: 'white', 
                fontSize: '18px',
                fontWeight: '500'
              }}>
                {member.role}
              </p>
            </div>
            {/* QR Code */}
            {qrCodeUrl && (
              <div style={{
                backgroundColor: 'white',
                padding: '8px',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                <img src={qrCodeUrl} alt="QR Code" style={{ width: '112px', height: '112px', display: 'block' }} />
                <p style={{ 
                  fontSize: '12px', 
                  textAlign: 'center', 
                  color: '#4B5563',
                  marginTop: '4px'
                }}>Scan me</p>
              </div>
            )}
          </div>

          {/* Contact info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span style={{ fontSize: '14px' }}>{member.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span style={{ fontSize: '14px' }}>{member.phone}</span>
            </div>
          </div>

          {/* Bottom branding */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {member.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white'
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>PALETTO</span>
          </div>
        </div>

        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          right: '-32px',
          bottom: '-32px',
          width: '128px',
          height: '128px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)'
        }} />
        <div style={{
          position: 'absolute',
          right: '-16px',
          bottom: '-16px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)'
        }} />
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
