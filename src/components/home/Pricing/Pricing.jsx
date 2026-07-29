import { ShoppingBag } from 'lucide-react';
import Button from '../../common/Button/Button';
import group25Img from '../../../assets/group-25.png';
import group29Img from '../../../assets/group-29.png';
import styles from './Pricing.module.css';

const Pricing = () => {
  const plans = [
    {
      name: 'Basic',
      duration: '3month',
      price: '15.140',
      type: 'side',
    },
    {
      name: 'Suggested',
      duration: '6month',
      oldPrice: '24.990',
      price: '22.990',
      type: 'suggested',
    },
    {
      name: 'Premium',
      duration: '12month',
      price: '35.199',
      type: 'side',
    },
  ];

  // Two dedicated assets per theme now — no more CSS filter hack.
  const sideCardSrc = group29Img;

  return (
    <div id="price" className={styles.pricing}>
      {plans.map((plan, index) => {
        const isSuggested = plan.type === 'suggested';

        return (
          <div
            key={index}
            className={[
              styles.pricing__card,
              isSuggested ? styles['pricing__card--suggested'] : styles['pricing__card--side'],
            ].join(' ')}
          >
            {/* 1. BACKGROUND SVG/PNG LAYER */}
            <img
              src={isSuggested ? group25Img : sideCardSrc}
              alt={plan.name}
              className={[
                styles.pricing__card_bg,
                isSuggested ? styles['pricing__card_bg--suggested'] : '',
              ].join(' ')}
            />

            {/* 2. SUGGESTED LINE OVERLAY */}
            {isSuggested && (
              <svg className={styles.pricing__line_overlay} viewBox="0 0 100 2" preserveAspectRatio="none">
                <line x1="0" y1="1" x2="100" y2="1" stroke="rgba(3, 10, 27, 1)" strokeWidth="2" strokeDasharray="6,6" />
              </svg>
            )}

            {/* 3. CONTENT OVERLAY LAYER */}
            <div
              className={[
                styles.pricing__content,
                isSuggested ? styles['pricing__content--suggested'] : styles['pricing__content--side'],
              ].join(' ')}
            >
              {/* Heading */}
              <h2
                className={[
                  styles.pricing__heading,
                  isSuggested ? styles['pricing__heading--suggested'] : styles['pricing__heading--side'],
                ].join(' ')}
              >
                {plan.name}
              </h2>

              {/* Duration */}
              <span className={styles.pricing__duration}>
                {plan.duration}
              </span>

              {/* Spacer */}
              <div
                className={isSuggested ? styles['pricing__spacer--suggested'] : styles['pricing__spacer--side']}
              />

              {/* Pricing Section */}
              <div className={styles.pricing__prices}>
                {plan.oldPrice && (
                  <span className={styles['pricing__old-price']}>
                    ${plan.oldPrice}
                  </span>
                )}
                <span className={styles.pricing__price}>
                  ${plan.price}
                </span>

                <div className={styles.pricing__disclaimer_container}>
                  <div
                    className={[
                      styles.pricing__disclaimer_dot,
                      isSuggested ? styles['pricing__disclaimer_dot--suggested'] : styles['pricing__disclaimer_dot--side'],
                    ].join(' ')}
                  />
                  <span className={styles.pricing__disclaimer_text}>
                    Cancel anytime
                  </span>
                </div>
              </div>

              {/* Continue button */}
              <Button
                variant={isSuggested ? 'suggested' : 'gradient'}
                className={[
                  styles.pricing__buy_button,
                  isSuggested ? styles['pricing__buy_button--suggested'] : styles['pricing__buy_button--side'],
                ].join(' ')}
                leftIcon={<ShoppingBag className={styles.pricing__bag_icon} />}
                onClick={() => handlePurchase(plan.name.toLowerCase())}
              >
                CONTIUNE
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Simple purchase handler log placeholder
const handlePurchase = (planName) => {
  console.log(`Purchase plan clicked: ${planName}`);
};

export default Pricing;
