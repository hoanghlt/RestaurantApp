using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Models;

namespace RestaurantAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly RestaurantDBContext _context;

        public OrderController(RestaurantDBContext context)
        {
            _context = context;
        }

        // GET: api/Order
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderMaster>>> GetOrderMasters()
        {
            return await _context.OrderMasters
                .Include(x=>x.Customer).ToListAsync();
        }

        // GET: api/Order/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderMaster>> GetOrderMaster(long id)
        {
            var orderDatails = await (from master in _context.Set<OrderMaster>()
                                      join detail in _context.Set<OrderDetail>()
                                      on master.OrderMasterID equals detail.OrderMasterID
                                      join foodItem in _context.Set<FoodItem>()
                                      on detail.FoodItemID equals foodItem.FoodItemID                                      
                                      where master.OrderMasterID == id

                                      select new
                                      {
                                          master.OrderMasterID,
                                          detail.OrderDetailID,
                                          detail.FoodItemID,
                                          detail.FoodItem,
                                          detail.Quantity,
                                          detail.FoodItemPrice,
                                          foodItem.FoodItemName
                                      }).ToListAsync();
            //var orderMaster = await _context.OrderMasters.FindAsync(id);
            var orderMaster = await (from a in _context.Set<OrderMaster>()
                                     join customer in _context.Set<Customer>()
                                     on a.CustomerID equals customer.CustomerID
                                     where a.OrderMasterID == id

                                     select new
                                     {
                                         a.OrderMasterID,
                                         a.OrderNumber,
                                         a.CustomerID,
                                         a.Customer,
                                         a.PMethod,
                                         a.GTotal,
                                         deletedOrderItemIDs = "",
                                         orderDetails = orderDatails
                                     }).FirstOrDefaultAsync();

            if (orderMaster == null)
            {
                return NotFound();
            }

            return Ok(orderMaster);
        }

        // PUT: api/Order/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrderMaster(long id, OrderMaster orderMaster)
        {
                if (id != orderMaster.OrderMasterID)
            {
                return BadRequest();
            }

            _context.Entry(orderMaster).State = EntityState.Modified;

            foreach(OrderDetail item in orderMaster.OrderDetails)
            {
                if (item.OrderDetailID == 0)
                    _context.OrderDetails.Add(item);
                else
                    _context.Entry(item).State = EntityState.Modified;
            }

            foreach(var i in orderMaster.DeletedOrderItemIDs.Split(',').Where(x => x != ""))
            {
                OrderDetail y = _context.OrderDetails.Find(Convert.ToInt64(i));
                _context.OrderDetails.Remove(y);
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderMasterExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Order
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<OrderMaster>> PostOrderMaster(OrderMaster orderMaster)
        {
            _context.OrderMasters.Add(orderMaster);
            await _context.SaveChangesAsync();

            //return CreatedAtAction("GetOrderMaster", new { id = orderMaster.OrderMasterID }, orderMaster);
            return NoContent();
        }

        // DELETE: api/Order/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderMaster(long id)
        {
            var orderMaster = await _context.OrderMasters.FindAsync(id);
            if (orderMaster == null)
            {
                return NotFound();
            }

            _context.OrderMasters.Remove(orderMaster);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderMasterExists(long id)
        {
            return _context.OrderMasters.Any(e => e.OrderMasterID == id);
        }
    }
}
