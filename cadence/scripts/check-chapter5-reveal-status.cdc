import SemesterZero from 0xce9dd43888d99574

/// Check if Chapter 5 NFTs have been revealed
access(all) fun main(): {String: String} {
    return {
        "revealed": SemesterZero.chapter5Revealed.toString(),
        "revealedImageURL": SemesterZero.chapter5RevealedImageURL,
        "totalNFTs": SemesterZero.totalChapter5NFTs.toString()
    }
}
