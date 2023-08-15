using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace RestaurantAPI.Models
{
    public class OrderDetail
    {
        [Key]
        public long OrderDetailID { get; set; }
        public long OrderMasterID { get; set; }
        public OrderMaster OrderMaster { get; set; }
        public int FoodItemID { get; set; }
        public FoodItem FoodItem { get; set; }        
        public decimal FoodItemPrice { get; set; }
        public int Quantity { get; set; }
    }
}
