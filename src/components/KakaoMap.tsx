'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Hospital, Pill, Loader2 } from 'lucide-react';
import { isDemoMode, type KakaoPlaceResult } from '@/lib/kakao';

interface KakaoMapProps {
    width?: string;
    height?: string;
    initialCenter?: { lat: number; lng: number };
    initialLevel?: number;
    showSearch?: boolean;
    searchKeyword?: string;
    markers?: Array<{
        lat: number;
        lng: number;
        title: string;
        address?: string;
    }>;
    onMarkerClick?: (marker: { lat: number; lng: number; title: string }) => void;
}

export function KakaoMap({
    width = '100%',
    height = '400px',
    initialCenter = { lat: 37.5665, lng: 126.9780 }, // 서울 시청
    initialLevel = 5,
    showSearch = true,
    searchKeyword = '',
    markers = [],
    onMarkerClick,
}: KakaoMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchKeyword);
    const [searchResults, setSearchResults] = useState<KakaoPlaceResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 지도 초기화
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // 데모 모드 체크
        if (isDemoMode()) {
            setError('카카오 API 키가 설정되지 않아 지도를 표시할 수 없습니다.');
            return;
        }

        // 카카오맵 SDK 로드 대기
        const initMap = () => {
            if (!window.kakao || !window.kakao.maps) {
                setTimeout(initMap, 100);
                return;
            }

            window.kakao.maps.load(() => {
                if (!mapContainerRef.current) return;

                const options = {
                    center: new window.kakao.maps.LatLng(initialCenter.lat, initialCenter.lng),
                    level: initialLevel,
                };

                mapRef.current = new window.kakao.maps.Map(mapContainerRef.current, options);
                setIsLoaded(true);

                // 초기 마커 표시
                if (markers.length > 0) {
                    addMarkers(markers);
                }

                // 초기 검색어가 있으면 검색
                if (searchKeyword) {
                    handleSearch(searchKeyword);
                }
            });
        };

        initMap();
    }, [initialCenter, initialLevel, searchKeyword]);

    // 마커 추가
    const addMarkers = useCallback((markerData: typeof markers) => {
        if (!mapRef.current || !window.kakao) return;

        // 기존 마커 제거
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        markerData.forEach((data) => {
            const position = new window.kakao.maps.LatLng(data.lat, data.lng);
            const marker = new window.kakao.maps.Marker({
                position,
                map: mapRef.current,
            });

            // 인포윈도우
            const infowindow = new window.kakao.maps.InfoWindow({
                content: `<div style="padding:5px;font-size:12px;max-width:200px;">
          <strong>${data.title}</strong>
          ${data.address ? `<br/><span style="color:#666;">${data.address}</span>` : ''}
        </div>`,
            });

            // 마커 클릭 이벤트
            window.kakao.maps.event.addListener(marker, 'click', () => {
                infowindow.open(mapRef.current, marker);
                if (onMarkerClick) {
                    onMarkerClick({ lat: data.lat, lng: data.lng, title: data.title });
                }
            });

            markersRef.current.push(marker);
        });

        // 첫 번째 마커 위치로 이동
        if (markerData.length > 0) {
            const firstPosition = new window.kakao.maps.LatLng(markerData[0].lat, markerData[0].lng);
            mapRef.current.setCenter(firstPosition);
        }
    }, [onMarkerClick]);

    // 장소 검색
    const handleSearch = useCallback((query: string) => {
        if (!mapRef.current || !window.kakao || !query) return;

        setIsSearching(true);
        setSearchResults([]);

        const ps = new window.kakao.maps.services.Places();

        ps.keywordSearch(query, (results: KakaoPlaceResult[], status: string) => {
            setIsSearching(false);

            if (status === window.kakao.maps.services.Status.OK) {
                setSearchResults(results.slice(0, 5));

                // 검색 결과를 마커로 표시
                const markerData = results.slice(0, 5).map((place) => ({
                    lat: parseFloat(place.y),
                    lng: parseFloat(place.x),
                    title: place.place_name,
                    address: place.address_name,
                }));

                addMarkers(markerData);
            } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                setError('검색 결과가 없습니다.');
                setTimeout(() => setError(null), 3000);
            }
        });
    }, [addMarkers]);

    // 검색 폼 제출
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(searchQuery);
    };

    // 빠른 검색 버튼
    const quickSearch = (keyword: string) => {
        setSearchQuery(keyword);
        handleSearch(keyword);
    };

    // 데모 모드 플레이스홀더
    if (error) {
        return (
            <Card className="w-full">
                <CardContent className="p-0">
                    <div
                        style={{ width, height }}
                        className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg"
                    >
                        <MapPin className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-center px-4">
                            {error}
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                            .env.local에 NEXT_PUBLIC_KAKAO_MAP_KEY를 설정해주세요.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    카카오맵
                </CardTitle>
                <CardDescription>
                    주변 병원 및 약국을 검색할 수 있습니다.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* 검색 영역 */}
                {showSearch && (
                    <div className="space-y-2">
                        <form onSubmit={handleSearchSubmit} className="flex gap-2">
                            <Input
                                placeholder="장소 검색 (예: 강남 병원)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit" disabled={isSearching}>
                                {isSearching ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Search className="h-4 w-4" />
                                )}
                            </Button>
                        </form>

                        {/* 빠른 검색 버튼 */}
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => quickSearch('내 주변 병원')}
                            >
                                <Hospital className="h-4 w-4 mr-1" />
                                주변 병원
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => quickSearch('내 주변 약국')}
                            >
                                <Pill className="h-4 w-4 mr-1" />
                                주변 약국
                            </Button>
                        </div>
                    </div>
                )}

                {/* 지도 */}
                <div
                    ref={mapContainerRef}
                    style={{ width, height }}
                    className="rounded-lg overflow-hidden border"
                >
                    {!isLoaded && !error && (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                    )}
                </div>

                {/* 검색 결과 목록 */}
                {searchResults.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">검색 결과</h4>
                        <ul className="space-y-1">
                            {searchResults.map((place, index) => (
                                <li
                                    key={place.id}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                                    onClick={() => {
                                        if (mapRef.current && window.kakao) {
                                            const position = new window.kakao.maps.LatLng(
                                                parseFloat(place.y),
                                                parseFloat(place.x)
                                            );
                                            mapRef.current.setCenter(position);
                                            mapRef.current.setLevel(3);
                                        }
                                    }}
                                >
                                    <p className="font-medium text-sm">{index + 1}. {place.place_name}</p>
                                    <p className="text-xs text-gray-500">{place.address_name}</p>
                                    {place.phone && (
                                        <p className="text-xs text-blue-500">{place.phone}</p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
