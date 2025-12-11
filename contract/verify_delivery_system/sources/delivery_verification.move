module delivery_verification::delivery_verification {
    use iota::object::{Self, UID};
    use iota::transfer;
    use iota::tx_context::{Self, TxContext};
    use std::string::{Self, String};

    /// Delivery record struct
    struct Delivery has key, store {
        id: UID,
        tracking_id: String,
        recipient: String,
        destination: String,
        items: String,
        status: u8,  // 0=PENDING, 1=IN_TRANSIT, 2=OUT_FOR_DELIVERY, 3=DELIVERED, 4=CANCELLED
        owner: address,
        created_at: u64,
        delivered_at: u64,
    }

    /// Status constants
    const STATUS_PENDING: u8 = 0;
    const STATUS_IN_TRANSIT: u8 = 1;
    const STATUS_OUT_FOR_DELIVERY: u8 = 2;
    const STATUS_DELIVERED: u8 = 3;
    const STATUS_CANCELLED: u8 = 4;

    /// Error codes
    const E_NOT_OWNER: u64 = 0;
    const E_INVALID_STATUS: u64 = 1;
    const E_ALREADY_DELIVERED: u64 = 2;

    /// Create a new delivery record
    public entry fun create_delivery(
        tracking_id: vector<u8>,
        recipient: vector<u8>,
        destination: vector<u8>,
        items: vector<u8>,
        ctx: &mut TxContext
    ) {
        let delivery = Delivery {
            id: object::new(ctx),
            tracking_id: string::utf8(tracking_id),
            recipient: string::utf8(recipient),
            destination: string::utf8(destination),
            items: string::utf8(items),
            status: STATUS_PENDING,
            owner: tx_context::sender(ctx),
            created_at: tx_context::epoch(ctx),
            delivered_at: 0,
        };
        
        transfer::share_object(delivery);
    }

    /// Update delivery status
    public entry fun update_status(
        delivery: &mut Delivery,
        new_status: u8,
        ctx: &mut TxContext
    ) {
        assert!(delivery.owner == tx_context::sender(ctx), E_NOT_OWNER);
        assert!(delivery.status != STATUS_DELIVERED, E_ALREADY_DELIVERED);
        assert!(new_status <= STATUS_CANCELLED, E_INVALID_STATUS);
        
        delivery.status = new_status;
    }

    /// Confirm delivery
    public entry fun confirm_delivery(
        delivery: &mut Delivery,
        ctx: &mut TxContext
    ) {
        assert!(delivery.owner == tx_context::sender(ctx), E_NOT_OWNER);
        assert!(delivery.status != STATUS_DELIVERED, E_ALREADY_DELIVERED);
        
        delivery.status = STATUS_DELIVERED;
        delivery.delivered_at = tx_context::epoch(ctx);
    }

    /// Get delivery status (view function)
    public fun get_status(delivery: &Delivery): u8 {
        delivery.status
    }

    /// Get tracking ID (view function)
    public fun get_tracking_id(delivery: &Delivery): String {
        delivery.tracking_id
    }

    /// Get recipient (view function)
    public fun get_recipient(delivery: &Delivery): String {
        delivery.recipient
    }
}
