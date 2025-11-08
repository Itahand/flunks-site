-- Create table for Chapter 5 NFT reveal mapping
CREATE TABLE IF NOT EXISTS chapter5_reveal_mapping (
    nft_id INTEGER PRIMARY KEY,
    placeholder_image TEXT NOT NULL DEFAULT 'https://storage.googleapis.com/flunks_public/images/1.png',
    revealed_image TEXT,
    revealed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reveal status table
CREATE TABLE IF NOT EXISTS chapter5_reveal_status (
    id INTEGER PRIMARY KEY DEFAULT 1,
    is_revealed BOOLEAN DEFAULT FALSE,
    revealed_image_url TEXT,
    revealed_at TIMESTAMP WITH TIME ZONE,
    CHECK (id = 1) -- Only allow one row
);

-- Insert default reveal status
INSERT INTO chapter5_reveal_status (id, is_revealed) 
VALUES (1, FALSE) 
ON CONFLICT (id) DO NOTHING;

-- Create function to get current image for an NFT
CREATE OR REPLACE FUNCTION get_chapter5_nft_image(nft_id_param INTEGER)
RETURNS TEXT AS $$
DECLARE
    is_revealed_var BOOLEAN;
    revealed_url TEXT;
    placeholder_url TEXT;
BEGIN
    -- Check if reveal has happened
    SELECT is_revealed, revealed_image_url INTO is_revealed_var, revealed_url
    FROM chapter5_reveal_status WHERE id = 1;
    
    IF is_revealed_var THEN
        RETURN revealed_url;
    ELSE
        -- Return placeholder
        SELECT placeholder_image INTO placeholder_url
        FROM chapter5_reveal_mapping WHERE nft_id = nft_id_param;
        
        RETURN COALESCE(placeholder_url, 'https://storage.googleapis.com/flunks_public/images/1.png');
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON chapter5_reveal_mapping TO authenticated;
GRANT SELECT, INSERT, UPDATE ON chapter5_reveal_status TO authenticated;
