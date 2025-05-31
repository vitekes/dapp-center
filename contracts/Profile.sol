// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Profile {
    struct SocialLink {
        string kind;
        string url;
    }
    struct DonationAddress {
        string currency;
        string addr;
    }
    struct NFTAvatar {
        address contractAddress;
        uint256 tokenId;
    }
    struct UserProfile {
        string handle;
        string bio;
        string email;
        SocialLink[] links;
        NFTAvatar avatar;
        DonationAddress[] donationAddrs;
        uint256 reputation;      // итоговый score
        string avatarCid;        // CID для аватара (если не NFT)
        string privateDataCID;   // CID приватных данных (если нужно)
    }

    mapping(address => UserProfile) private profiles;

    // Reputation voting: кто за кого голосовал (address => address => voted)
    mapping(address => mapping(address => bool)) public hasVoted;

    event ProfileUpdated(address indexed user);
    event ReputationChanged(address indexed user, int256 diff, uint256 newReputation);


    // Получить профиль пользователя (все поля)
    function getProfile(address user) external view returns (
        string memory handle,
        string memory bio,
        string memory email,
        SocialLink[] memory links,
        NFTAvatar memory avatar,
        DonationAddress[] memory donationAddrs,
        uint256 reputation,
        string memory avatarCid,
        string memory privateDataCID
    ) {
        UserProfile storage userProfile = profiles[user];
        return (
            userProfile.handle,
            userProfile.bio,
            userProfile.email,
            userProfile.links,
            userProfile.avatar,
            userProfile.donationAddrs,
            userProfile.reputation,
            userProfile.avatarCid,
            userProfile.privateDataCID
        );
    }

    // Обновить все поля профиля (кроме репутации)
    function setProfile(
        string memory handle,
        string memory bio,
        string memory email,
        SocialLink[] memory links,
        NFTAvatar memory avatar,
        DonationAddress[] memory donationAddrs,
        string memory avatarCid,
        string memory privateDataCID
    ) external {
        UserProfile storage p = profiles[msg.sender];
        p.handle = handle;
        p.bio = bio;
        p.email = email;

        delete p.links;
        for (uint i = 0; i < links.length; i++) {
            p.links.push(links[i]);
        }
        p.avatar = avatar;
        p.avatarCid = avatarCid;

        delete p.donationAddrs;
        for (uint i = 0; i < donationAddrs.length; i++) {
            p.donationAddrs.push(donationAddrs[i]);
        }

        p.privateDataCID = privateDataCID;

        emit ProfileUpdated(msg.sender);
    }

    // Репутация: каждый может проголосовать за другого пользователя 1 раз (upvote/downvote)
    function voteReputation(address user, bool up) external {
        require(user != msg.sender, "Can't vote for yourself");
        require(!hasVoted[msg.sender][user], "Already voted for this user");

        hasVoted[msg.sender][user] = true;
        if (up) {
            profiles[user].reputation += 1;
            emit ReputationChanged(user, 1, profiles[user].reputation);
        } else {
            if (profiles[user].reputation > 0) {
                profiles[user].reputation -= 1;
                emit ReputationChanged(user, -1, profiles[user].reputation);
            }
        }
    }

    // Удалить свой профиль (по желанию пользователя)
    function deleteProfile() external {
        delete profiles[msg.sender];
        emit ProfileUpdated(msg.sender);
    }
}
