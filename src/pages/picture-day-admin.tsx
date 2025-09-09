import React, { useState, useEffect } from 'react';
import { Window, WindowContent, Button, TextField, Select } from 'react95';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { getCurrentBuildMode, isFeatureEnabled } from '../utils/buildMode';

const AdminContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: 'Comic Sans MS', cursive, sans-serif;
`;

const AdminWindow = styled(Window)`
  max-width: 1200px;
  margin: 0 auto;
`;

const Section = styled.div`
  margin: 20px 0;
  padding: 15px;
  border: 2px solid #ccc;
  border-radius: 5px;
`;

const CandidateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
`;

const CandidateCard = styled.div`
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
  background: #f9f9f9;
`;

const PhotoPreview = styled.img`
  max-width: 200px;
  max-height: 250px;
  object-fit: cover;
  border: 2px solid #ccc;
  margin: 10px 0;
`;

interface Candidate {
  id: string;
  clique: string;
  name: string;
  photo_url: string | null;
}

const PictureDayAdmin: React.FC = () => {
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedClique, setSelectedClique] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Check if Picture Day is enabled in current build mode
  const isPictureDayEnabled = isFeatureEnabled('showPictureDay');
  
  // If not in build mode, redirect
  useEffect(() => {
    if (!isPictureDayEnabled) {
      console.log('Picture Day Admin is only available in build mode');
      router.push('/');
      return;
    }
  }, [isPictureDayEnabled, router]);

  const cliques = [
    { value: 'all', label: 'All Cliques' },
    { value: 'preps', label: 'The Preps' },
    { value: 'jocks', label: 'The Jocks' },
    { value: 'geeks', label: 'The Geeks' },
    { value: 'freaks', label: 'The Freaks' }
  ];

  useEffect(() => {
    if (isPictureDayEnabled) {
      fetchCandidates();
    }
  }, [isPictureDayEnabled]);

  const fetchCandidates = async () => {
    try {
      // This would typically require admin authentication
      const response = await fetch('/api/picture-day/admin/candidates');
      const data = await response.json();
      setCandidates(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
      setLoading(false);
    }
  };

  const updateCandidate = async (candidateId: string, updates: Partial<Candidate>) => {
    setUpdating(candidateId);
    try {
      const response = await fetch(`/api/picture-day/admin/${candidateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        await fetchCandidates(); // Refresh the list
        alert('Candidate updated successfully!');
      } else {
        alert('Failed to update candidate');
      }
    } catch (error) {
      console.error('Error updating candidate:', error);
      alert('Error updating candidate');
    } finally {
      setUpdating(null);
    }
  };

  const handlePhotoUrlChange = (candidateId: string, photoUrl: string) => {
    setCandidates(prev => prev.map(candidate => 
      candidate.id === candidateId 
        ? { ...candidate, photo_url: photoUrl }
        : candidate
    ));
  };

  const handleNameChange = (candidateId: string, name: string) => {
    setCandidates(prev => prev.map(candidate => 
      candidate.id === candidateId 
        ? { ...candidate, name }
        : candidate
    ));
  };

  const filteredCandidates = selectedClique === 'all' 
    ? candidates 
    : candidates.filter(c => c.clique === selectedClique);

  if (loading) {
    return (
      <AdminContainer>
        <div style={{ textAlign: 'center', color: 'white', paddingTop: '200px' }}>
          Loading admin panel...
        </div>
      </AdminContainer>
    );
  }

  if (!isPictureDayEnabled) {
    return (
      <AdminContainer>
        <div style={{ 
          textAlign: 'center', 
          color: 'white', 
          paddingTop: '200px',
          fontSize: '1.5rem'
        }}>
          🔒 Picture Day Admin is only available in build mode...
        </div>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <AdminWindow>
        <WindowContent>
          <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>
            📸 Picture Day Admin Panel
          </h1>
          
          <Section>
            <h3>Filter by Clique</h3>
            <Select 
              value={selectedClique}
              onChange={(option) => setSelectedClique(option.value)}
              options={cliques}
            />
          </Section>

          <Section>
            <h3>Candidates ({filteredCandidates.length})</h3>
            <CandidateGrid>
              {filteredCandidates.map(candidate => (
                <CandidateCard key={candidate.id}>
                  <h4>{candidate.clique.toUpperCase()}: {candidate.name}</h4>
                  
                  <div>
                    <label>Name:</label>
                    <TextField
                      value={candidate.name}
                      onChange={(e) => handleNameChange(candidate.id, e.target.value)}
                      style={{ width: '100%', margin: '5px 0' }}
                    />
                  </div>

                  <div>
                    <label>Photo URL:</label>
                    <TextField
                      value={candidate.photo_url || ''}
                      onChange={(e) => handlePhotoUrlChange(candidate.id, e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      style={{ width: '100%', margin: '5px 0' }}
                    />
                  </div>

                  {candidate.photo_url && (
                    <PhotoPreview 
                      src={candidate.photo_url} 
                      alt={candidate.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}

                  <Button
                    onClick={() => updateCandidate(candidate.id, {
                      name: candidate.name,
                      photo_url: candidate.photo_url
                    })}
                    disabled={updating === candidate.id}
                    style={{ marginTop: '10px', width: '100%' }}
                  >
                    {updating === candidate.id ? 'Updating...' : 'Update Candidate'}
                  </Button>
                </CandidateCard>
              ))}
            </CandidateGrid>
          </Section>

          <Section>
            <h3>Instructions</h3>
            <ul>
              <li>Upload images to a hosting service (like Cloudinary, AWS S3, or similar)</li>
              <li>Copy the public URL of the image</li>
              <li>Paste the URL in the "Photo URL" field for each candidate</li>
              <li>Click "Update Candidate" to save changes</li>
              <li>Images should be approximately 200x250 pixels for best results</li>
            </ul>
          </Section>
        </WindowContent>
      </AdminWindow>
    </AdminContainer>
  );
};

export default PictureDayAdmin;
