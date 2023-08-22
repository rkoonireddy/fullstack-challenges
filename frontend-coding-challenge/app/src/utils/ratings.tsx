import { useEffect, useState, useRef } from "react";
import { RatingProps } from "../classBlocks/dataTypes";
import starFilled from "../assets/star-filled.svg";
import starUnfilled from "../assets/star-unfilled.svg";

export default function Rating({ storeId }: RatingProps) {
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const userClicked = useRef(false);

  useEffect(() => {
    getRating();
  }, [userRating]);

  const getRating = async () => {
    try {
      const response = await fetch(`http://localhost:3000/stores/${storeId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // console.log("api is working");
      const data = await response.json();
      const storeRating = data.data.attributes.rating;
      setRating(storeRating);
    } catch (error) {
      console.error("Error fetching rating:", error);
    }
  };

  const generateRatingBar = (rating: number) => {
    const ratingBar = [];
    for (let i = 0; i < rating; i++) {
      ratingBar.push(
        <img
          key={i + 1}
          className="w-6 cursor-pointer"
          src={starFilled}
          alt="⭐"
          onMouseEnter={() => {
            userClicked.current = false;
            setUserRating(i + 1);
          }}
          onMouseLeave={() => {
            if (userClicked.current === false) {
              setUserRating(0);
            }
          }}
          onClick={() => {
            userClicked.current = true;
            setUserRating(i + 1);
            updateRating(i + 1);
          }}
        />
      );
    }
    for (let i = 0; i < 5 - rating; i++) {
      ratingBar.push(
        <img
          key={rating + i + 1}
          className="w-6 cursor-pointer"
          src={starUnfilled}
          alt="⭐"
          onMouseEnter={() => {
            userClicked.current = false;
            setUserRating(rating + i + 1);
          }}
          onMouseLeave={() => {
            if (userClicked.current === false) {
              setUserRating(0);
            }
          }}
          onClick={() => {
            userClicked.current = true;
            setUserRating(rating + i + 1);
            updateRating(rating + i + 1);
          }}
        />
      );
    }
    return ratingBar;
  };

  const updateRating = async (newRating: number) => {
    try {
      const response = await fetch(`http://localhost:3000/stores/${storeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/vnd.api+json",
          Accept: "application/vnd.api+json",
        },
        body: JSON.stringify({
          data: {
            type: "stores",
            id: storeId,
            attributes: {
              rating: newRating,
            },
          },
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  return (
    <div className="flex items-center select-none gap-1">
      {userRating === 0
        ? generateRatingBar(rating)
        : generateRatingBar(userRating)}
    </div>
  );
}
